---
title: 'Favourite Footguns Pt 4: Not flipping a ByteBuffer'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2023-May-9'
show_post_footer: true
excerpt: >

---

`java.nio.ByteBuffer` is one of my favourite classes to work with on the JVM. You can use it for manipulating data in memory, such as byte-level data structures, reading from and writing to sockets, and parsing data received from a network. It can also be created with different types of backing arrays and can also be used with memory-mapped files. It is also nice because APIs are provided to allocate buffer both on and off the JVM heap. However, weird things can happen if you don't flip the buffer. Here is an example:

```java
public class BBNoFlip {

    public static void main(String[] args) {

        // Encode a message into a ByteBuffer
        String message = "Long live Duke!";
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        buffer.put(message.getBytes(StandardCharsets.UTF_8));

        // Decode the message from the ByteBuffer
        byte[] messageBytes = new byte[buffer.remaining()];
        buffer.get(messageBytes);
        String decodedMessage = new String(messageBytes, StandardCharsets.UTF_8);

        System.out.println("Original: " + message);
        System.out.println("Decoded: " + decodedMessage);
    }
}
```

The output is as follows (_decoded_ truncated for this post):

```bash
Original: Long live Duke!
Decoded:                                   
```

The String `Long live Duke!` is 15 bytes, and we allocated 1024 bytes of Buffer space onto the JVM via `ByteBuffer.allocate`. When we read the data back out of the buffer into a new byte array, we get 1019 bytes of NULL or garbage (whatever happens to be in the buffer) and our encoded data. This could be problematic if you are reading data off a network connection and writing it to a database of somesort.

The remedy is `ByteBuffer.flip`. When we call `ByteBuffer.flip` we set the limit to the current position and reset the position back to 0. 

```java
public class BBFlip {

    public static void main(String[] args) {

        // Encode a message into a ByteBuffer
        String message = "Long live Duke!";
        ByteBuffer buffer = ByteBuffer.allocateDirect(1024);
        buffer.put(message.getBytes(StandardCharsets.UTF_8));

        // flip the buffer (obviously)
        buffer.flip();

        // Decode the message from the ByteBuffer
        byte[] messageBytes = new byte[buffer.remaining()];
        buffer.get(messageBytes);
        String decodedMessage = new String(messageBytes, StandardCharsets.UTF_8);

        System.out.println("Original: " + message);
        System.out.println("Decoded: " + decodedMessage);
    }
}
```

Success 🙌 The data was written into the buffer and decoded with much success, and feet in tact. 


```bash
Original: Long live Duke!
Decoded: Long live Duke!
```
