---
title: 'Favourite Footguns Pt 2: Leaking secrets'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2022-Jan-12'
excerpt: >
  This post looks at one of my favourite footguns - leaking secrets.
---

A practice that gets a lot of attention these days is mishandling secrets and other sensitive material. When I moved from the finance industry into security I started thinking about better ways to write _secure code_. I have come to learn that secret management is a tricky business to get correct 100% of the time. Because of this, I am now operating under the practice that secrets will leak, and it really sucks when it happens. The art here is motivating people enough to fix the leak, promote a culture of secure coding and leveraging state-of-the-art infrastructure to _manage_ (rather than just _store_) sensitive material. Accompanying code in this post is written in Scala (Dotty) 3.1.0 (the latest release at time of writing).

### Thought 1: Secret as a Type

Assuming you have access to a strongly typed programming language like Scala, you can wrap a String (or really any type) as a class to wrap the value and mask it if a caller tries to send it to a log or stream. 

```scala
class Secret(private val secret: String) {
  def get = secret
  override def toString = "********"
}

object SecretsExample extends App {
  val secret = Secret("this is so secret 🤐")
  println(s"I have a secret: $secret")
}
```

### Thought 2: Read-Once Objects

I like the idea of only allowing a value to be read once from an object, and subsequent readers get informed of a message explaining that it has already been read. A good way of doing this is returning a Tuple/Pair like structure with the secret in the left element, and a message in the right element to communicate why the secret is null. This is a good strategy for combating unintended use by programmers.

```scala
import java.util.concurrent.atomic.AtomicReference

class ReadOnceValue(value: AtomicReference[String]) {
  
  def get: (String, String) = {
    val secret = value.getAndSet(null)
  
    if (secret == null) {
      return (null, "Read-once value has already been returned")
    } else {
      return (secret, null)
    }
  }
}

object Main extends App {
  val sensitive = ReadOnceValue(AtomicReference("p4ssword"))
  println(sensitive.get) // ==> (p4ssword,null)
  println(sensitive.get) // ==> (null,Read-once value has already been returned)
  println(sensitive.get) // ==> (null,Read-once value has already been returned)
}
```

### Thought 3: Failing on unintended use

Doubling down on the previous thought, another strategy I think that is quite effective is failing on unintended use by another part of the application. This is easy to do by extending the java.io.Externalizable interface and throw an exception on unintended serialization. 

```scala
import java.io.{Externalizable, FileInputStream, FileOutputStream, ObjectInput, ObjectOutput, ObjectOutputStream}
import java.util.concurrent.atomic.AtomicReference

class ReadOnceValue(value: AtomicReference[String]) extends Externalizable {
  
  def get: (String, String) = {
    val secret = value.getAndSet(null)
  
    if (secret == null) {
      return (null, "Read-once value has already been returned")
    } else {
      return (secret, null)
    }
  }
  
  override def readExternal(in: ObjectInput): Unit = fail()

  override def writeExternal(out: ObjectOutput): Unit = fail()

  def fail(): Unit =
    throw UnsupportedOperationException("Not permitted on sensitive value")
}

object Main extends App {
  val sensitive = ReadOnceValue(AtomicReference("p4ssword"))
  
  val outStream = ObjectOutputStream(FileOutputStream("/tmp/tmpfile.txt"))
  outStream.writeObject(sensitive) // ==> 💥 Throws UnsupportedOperationException
  outStream.close()
}
```

### Thought 4: Handle Errors / Exceptions carefully

When I was younger and first using the internet I used to get a lot of 'The Webmaster has been notified' messages when a website fell over for some sort of reason. Then I started seeing a lot of blank pages with status codes and exception messages that I didn't understand as teenager. The internet seems to have grown up, which is great, but some applications continue to serve users with exception messages which can reveal system information to a bad actor. It can communicate the internal structure of an application such as the language, libraries, class heirarchy and can arm a malacious actor with enough information to exploit the application and access sensitive resources such as databases, LDAP servers, sensitive network information. 

Exceptions can be great for developers (personal opinion), but they are not a good user experience. Chances are a user won't know what to do with the information, kind of like me when I was younger. From experience, I think traping exceptions to avoid leaking sensitive data by proxy is a good idea. 

```scala
def iCanFail(name: String): String = {
  if (name != "pete") {
    throw Exception("You are not pete")
  }
  
  return s"Hi, ${name}"
}

object ExMain extends App {
  
  try {
    println(iCanFail("sarah"))
  } catch {
    case e => {
      // Log to inform dev
      logger.error("Failed to handle input", e)
      // Provide a better user experience with explanation
      println("Sorry, our service can't handle your request right now. We're on it!")
    } 
  }
}
```

### Thought 5: Obfuscation by Symmetric Encryption

Encryption can be thought of as a 2 way pure function that can mask data. It can be accomplished using a shared key (Symmetric) or Public/Private key pair (Asymmetric). The JCA allows programmers to use cryptographic functionality such as Secure Random, Hashing Algos, Sym/Asym Enryption and more. The implementation of the JRC is left up to the JRE vendors to create their own implementation and multiple algorithm implementations may exist on the classpath at one time. I don't particularly like this method as the secret key tends to get shared around multiple programmers and then there is a trust factor and human accidental leak risk.

```scala
import java.security.SecureRandom
import javax.crypto.spec.{IvParameterSpec, SecretKeySpec}
import javax.crypto.{Cipher, KeyGenerator, SecretKey}
import org.bouncycastle.util.encoders.Hex

class SymEncrypt {

  private val aes = "AES"
  private val cipherAlgo = "AES/CBC/PKCS5Padding"
  
  def createAESKey(): SecretKey = {
    val secureRandom = SecureRandom()
    val keyGenerator = KeyGenerator.getInstance(aes)
    keyGenerator.init(256, secureRandom)
    return keyGenerator.generateKey()
  }
  
  // I have seen developers hardcode the initialization vector in code so they don't need
  // to store as a separate secret. 
  def createInitializationVector(): Array[Byte] = {
    val secureRandom = SecureRandom()
    val initializationVector = new Array[Byte](16)
    secureRandom.nextBytes(initializationVector)
    return initializationVector
  }
  
  def aesEcrypt(plainText: String, secretKey: SecretKey, initializationVector: Array[Byte]): Array[Byte] = {
    val cipher = Cipher.getInstance(cipherAlgo) 
    val ivParameterSpec = IvParameterSpec(initializationVector)
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivParameterSpec)
    return cipher.doFinal(plainText.getBytes())
  }
  
  def aesDecrypt(cipherText: Array[Byte], secretKey: SecretKey, initializationVector: Array[Byte]): String = {
    val cipher = Cipher.getInstance(cipherAlgo)
    val ivParameterSpec = IvParameterSpec(initializationVector)
    cipher.init(Cipher.DECRYPT_MODE, secretKey, ivParameterSpec)
    val decryptedText = cipher.doFinal(cipherText)
    return String(decryptedText)
  }
}

// Bouncy Castle on classpath
// https://mvnrepository.com/artifact/org.bouncycastle/bcprov-jdk15on
// libraryDependencies += "org.bouncycastle" % "bcprov-jdk15on" % "1.70"
object Main extends App {
  
  // Generate AES (Symmetric) encryption key
  val enc = SymEncrypt()
  val key = enc.createAESKey()
  println(Hex.toHexString(key.getEncoded()))

  val initVector = enc.createInitializationVector()
  val sensitiveText = "End programming language culture wars!"
  
  // Symmetrically enrypt some plain text
  val encryptedText = enc.aesEcrypt(sensitiveText, key, initVector)
  println(Hex.toHexString(encryptedText))
  
  // Symmetrically decrypt some plain text
  val decryptedText = enc.aesDecrypt(encryptedText, key, initVector)
  println(decryptedText)
}
```

### Thought 5: Obfuscation by Asymmetric Encryption

A more secure way of encrypting data is with asymmetric encryption. Instead of a shared key, data is encrypted with a private key (not shareable) and decrypted with a public key (sharable with sources you trust). Keys can be managed securely by hardware or services such as AWS KMS.

```scala
import java.security.{KeyPair, KeyPairGenerator, PrivateKey, PublicKey, SecureRandom}

import javax.crypto.Cipher
import org.bouncycastle.util.encoders.Hex

class AsymEncrypt {

  private val rsa = "RSA"
  
  def createRSAKeyPair(): KeyPair = {
    val secureRandom = SecureRandom()
    val keyPairGenerator = KeyPairGenerator.getInstance(rsa)
    keyPairGenerator.initialize(4096, secureRandom)
    return keyPairGenerator.generateKeyPair()
  }
  
  // Encrypt with the private key
  def rsaEncrypt(plainText: String, privateKey: PrivateKey): Array[Byte] = {
    val cipher = Cipher.getInstance(rsa)
    cipher.init(Cipher.ENCRYPT_MODE, privateKey)
    return cipher.doFinal(plainText.getBytes())
  }
  
  // Decrypt with the public key
  def rsaDecrypt(cipherText: Array[Byte], publicKey: PublicKey): String = {
    val cipher = Cipher.getInstance(rsa)
    cipher.init(Cipher.DECRYPT_MODE, publicKey)
    val result = cipher.doFinal(cipherText)
    return String(result)
  }
}

// Bouncy Castle on classpath
// https://mvnrepository.com/artifact/org.bouncycastle/bcprov-jdk15on
// libraryDependencies += "org.bouncycastle" % "bcprov-jdk15on" % "1.70"
object Main extends App {

  // Generate RSA (Asymmetric) encryption key pair
  val enc = AsymEncrypt()
  val keyPair = enc.createRSAKeyPair()
  println(s"Private Key ${Hex.toHexString(keyPair.getPrivate().getEncoded)}")
  println(s"Public Key  ${Hex.toHexString(keyPair.getPublic().getEncoded)}")

  val sensitiveText = "All day and night I drink coffee"
  println(s"Original Text: ${sensitiveText}")
  
  // Asymmetrically enrypt some plain text
  val encryptedText = enc.rsaEncrypt(sensitiveText, keyPair.getPrivate())
  println(s"Encrypted Text: ${Hex.toHexString(encryptedText)}")

  // Asymmetrically decrypt some plain text
  val decryptedText = enc.rsaDecrypt(encryptedText, keyPair.getPublic())
  println(s"Decrypted Text: ${decryptedText}")
}
```

### Thought 6: Mishandling heap dumps

An interesting thought I had while concluding this post is what is secrets could be leaked via a heap dump as most of the secrets will be held in memory - very likely on the heap. That would be truely the worst way to get pwned. Having a management and deletion culture of heap dumps, and a secure way or getting and storing them would be ideal.

### Parting thoughts

There is no _one way_ to manage sensitive material, but there are a few steps that can be taken to mitigate the potential leaks and attack avenues. I think it is important to be cognizant of best practices, cultivate a culture of care and pave the path for other developers not to leak secrets indirectly. 