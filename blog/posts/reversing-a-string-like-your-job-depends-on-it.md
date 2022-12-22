---
title: 'Reversing a string like your job depends on it'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2022-Dec-22'
show_post_footer: true
excerpt: >

---

A team I used to work on used to give what is generally considered an elementary problem as the final coding stage - reversing a string. The argument by the person who proposed this task was that it weeds out those who talk a good game but can't rise to the challenge of simple programming tasks. While there is a debate to be had here about its effectiveness, it did seem to produce interesting results. The team programmed exclusively on the JVM / CLR so using dynamic runtimes like Python, Ruby or JavaScript were not allowed. Having a proficient understanding of the underlying runtime was considered somewhat important.

What I liked about this challenge was the conversation that it started - leading to all sorts of interesting discussions about runtime complexity, text encodings, test-driven design, concurrency concerns when multiple threads were reversing, and generally how computer code is run on a Virtual Machine / CPU. But this leads to an interesting question - what is the best way to reverse a string? In this post I am using Kotlin 1.7.21 with no build tooling, running on JDK 17.

## The obvious

```kotlin
fun reverseString(str: String): String {
    return str.reversed()
}
```

Github Copilot's only recommendation for reversing a string with the `reversed()` function. This is a Kotlin nicety that chains Java's `StringBuilder.reverse().toString()` methods under the hood as part of its standard library text utilities `kotlin.text`. To me, this is the most obvious thing you could do. While this would likely be the sane thing to do in production (if you would ever need to reverse strings in production), it's probably not the answer an interviewer is looking for, as they would likely want you to implment the `reverse()` method yourself.

## My take

I remember my submission - [without the tests] it looked something like this: 

```kotlin
fun reverseString(str: String): String {
    val sb = StringBuilder(str.length)
    for (l in str)
        sb.insert(0, l) // insert at front of buffer
 
 	return sb.toString()
}

fun main() {
    val test1 = reverseString("Howdy, Cowboy!")
    println(test1) 
    // ==> !yobwoC ,ydwoH
}
```

Here, I create a `StringBuilder` object, and instanciate it with the length of the input string. This is so the byte buffer used to store the character sequence doesn't have to dynamically resize after each insert. Also, if there is no provided value in the constructor it will default to a size of 16 characters I then loop over the input string one character at a time, inserting it at the front of the StringBuilders buffer. Once the buffer is filled I then return a string representation of the `StringBuilder` back to the caller. Let's take a closer look at the bytecode...

```kotlin
// Decompiled for Java 17 LTS

public final static reverseString(Ljava/lang/String;)Ljava/lang/String;
  @Lorg/jetbrains/annotations/NotNull;() // invisible
    // annotable parameter count: 1 (visible)
    // annotable parameter count: 1 (invisible)
    @Lorg/jetbrains/annotations/NotNull;() // invisible, parameter 0
   L0
    ALOAD 0
    LDC "str"
    INVOKESTATIC kotlin/jvm/internal/Intrinsics.checkNotNullParameter (Ljava/lang/Object;Ljava/lang/String;)V
   L1
    LINENUMBER 4 L1
    NEW java/lang/StringBuilder
    DUP
    ALOAD 0
    INVOKEVIRTUAL java/lang/String.length ()I
    INVOKESPECIAL java/lang/StringBuilder.<init> (I)V
    ASTORE 1
   L2
    LINENUMBER 5 L2
    ICONST_0
    ISTORE 2
    ALOAD 0
    INVOKEVIRTUAL java/lang/String.length ()I
    ISTORE 3
   L3
    ILOAD 2
    ILOAD 3
    IF_ICMPGE L4
   L5
    ALOAD 0
    ILOAD 2
    INVOKEVIRTUAL java/lang/String.charAt (I)C
    ISTORE 4
   L6
    ALOAD 1
    ICONST_0
    ILOAD 4
    INVOKEVIRTUAL java/lang/StringBuilder.insert (IC)Ljava/lang/StringBuilder;
    POP
   L7
    IINC 2 1
    GOTO L3
   L4
    LINENUMBER 7 L4
    ALOAD 1
    INVOKEVIRTUAL java/lang/StringBuilder.toString ()Ljava/lang/String;
    DUP
    LDC "sb.toString()"
    INVOKESTATIC kotlin/jvm/internal/Intrinsics.checkNotNullExpressionValue (Ljava/lang/Object;Ljava/lang/String;)V
    ARETURN
   L8
    LOCALVARIABLE l C L6 L7 4
    LOCALVARIABLE sb Ljava/lang/StringBuilder; L2 L8 1
    LOCALVARIABLE str Ljava/lang/String; L0 L8 0
    MAXSTACK = 3
    MAXLOCALS = 5
```

Dissembling the method doesn't tell me anything I don't know about how I have written it, but I suspect there might be something more going on behind the scenes of the `StringBuilder` class, particularly the `insert()` method. A suspicion that I didn't have of at the time of writing is what happens when you _insert at the front_ - I can't imagine shifting everything right is a free lunch.

Reading through the OpenJDK implementation, this is what we are calling

```java
// See above Bytecode
// INVOKEVIRTUAL java/lang/StringBuilder.insert (IC)Ljava/lang/StringBuilder;

public AbstractStringBuilder insert(int offset, char[] str) {
    checkOffset(offset, count);
    int len = str.length;
    ensureCapacityInternal(count + len);
    shift(offset, len);
    count += len;
    putCharsAt(offset, str, 0, len);
    return this;
}
```

The first method `checkOffset` checks to see if the caller is trying to insert outside the bounds of the buffer - if it is trying to do that it will throw a `StringIndexOutOfBoundsException`. It's a handy safeguard, but it's not too interesting in this context.

`ensureCapacityInternal` is rather interesting code however - it will resize the buffer if there is not enough capacity for the insert. 

```java
// AbstractStringBuilder.ensureCapacityInternal

private void ensureCapacityInternal(int minimumCapacity) {
    // overflow-conscious code
    int oldCapacity = value.length >> coder;
    if (minimumCapacity - oldCapacity > 0) {
        value = Arrays.copyOf(value,
                newCapacity(minimumCapacity) << coder);
    }
}
```

`shift` is where my suspicion is address.

```java
// AbstractStringBuilder.shift

private void shift(int offset, int n) {
    System.arraycopy(value, offset << coder,
                        value, (offset + n) << coder, (count - offset) << coder);
}
```

`System.arraycopy` copies a source array at a position, to a destination array from a position.

## How does StringBuilder reverse a string?

So how does the `StringBuilder` class reverse a string?

```java
public AbstractStringBuilder reverse() {
    byte[] val = this.value;
    int count = this.count;
    int n = count - 1;
    if (isLatin1()) {
        for (int j = (n-1) >> 1; j >= 0; j--) {
            int k = n - j;
            byte cj = val[j];
            val[j] = val[k];
            val[k] = cj;
        }
    } else {
        StringUTF16.reverse(val, count);
    }
    return this;
}
```

In this article I am only looking at the `isLatin1()` branch of the conditional. This is where most english words would fall into as each character is 1 byte long. However, I would imagine _in the real world_ the condition would likely fall into the `else` block. 
I really like this code - particularly the `for` loop. But why?

```java
for (int j = (n-1) >> 1; j >= 0; j--) {
    int k = n - j;
    byte cj = val[j];
    val[j] = val[k];
    val[k] = cj;
}
```

More often than not, programmers will iterate over the full length of the string to reverse it - including my solution, but that is not what is happening here with this bitwise operation.

```java
int j = (n-1) >> 1
// if n = 10, then j = 5
// if n = 25, then j = 12
// if n = 99, then j = 49
```

This bit shifting finds the middle byte `j`. If the string letter count is even, `k` will be the same as `j`, otherwise it will be the byte to the right position. A temporary variable `cj` is used to stage the value for the swap.

```java
byte cj = val[j];
val[j] = val[k];
val[k] = cj;
```

So if a string 10 characters long, there are 5 iterations through the loop. If it is 11, there will stil be 5 iterations. If the string is 12 characters long it will be 6 iterations... and so on.

This is tight code in terms of performance and speed. It doesn't do any unnecessary allocation, doesn't loop over the entire string, and does a bitwise right shift instead of a divide by two. However, the bitwise shift doesn't necessarily mean increased perf on some CPUs, but for a Java standard library function, this is a good approach where the runtime isn't clear and aligns with the _write once, run anywhere_ mantra. I suspect that is why I see this approach sometimes in library code, but almost never in application code.

I'm not sure this solution would fly in an interview however. A lot of information systems developers might not know a lot about bit shifting, and some may prefer functional approaches such as using only immutable data structures. It would probably be best to ask the interviewer for clarification on the trade-offs acceptable and gauge a sense of their biases and preferences. Are you writing something for your fellow programmers, or are you trying to create the fastest `reverse` function in town? These yield different solutions.

## What on earth did I just read?

On looking back, although my solution has an non-obvious buffer shift, I still think it is a clean and tight way of solving the problem in Kotlin _or_ Java, partically when being timed and having a stranger staring over your shoulder scrutinizing your code. It is immediately clear to a reader what is happening, and takes into consideration what is happening inside the `StringBuilder` class. It is thread-safe in the sense that a new StringBuilder object is allocated per invocation of the method and doesn't hoist any state to the class level - although StringBuilder itself is not thread-safe, see `StringBuffer` instead.

This was just one mans retrospective of a fun interview question. Maybe it's software engineering rigour, but it might also be bikeshedding. I will let you decide. 
