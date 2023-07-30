---
title: 'IPC - Sharing memory between JVMs'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2023-Jul-30'
excerpt: >
  yo
---

Oftentimes, software need to talk to other software - this is where IPC (Inter-Process Communication) comes in if they are located on the same physical resource. They can take advantage of numerous messaging fabic such as message queues, sockets, HTTP, UDP, and countless others - many I have never heard of! Utilising shared memory is one of the fastest ways of of passing data between processes (Between JVMs or others) on the same machine because it's stored virtually in memory. It is not limited to the JVM heap space - it's limited by disk space and can run orders of magnatiude faster than traditional messaging passing frameworks. In this example I present a **1 producer / 1 consumer** setup where data is written to a memory-mapped file, and read and printed. This is the simplist example I could come up with.

## Consumer

Let's write the consumer as that is what we will run first. First, I constrain the message buffer to 1024 Bytes and then open a `RandomAccessFile` called `smem.dat` (shared memory dot data). The `RandomAccessFile` acts as a large array of bytes stored in the file system. `RandomAccessFile.getChannel()` returns a reading/writing channel to that file. `channel.map(FileChannel.MapMode.READ_WRITE, 0, MESSAGE_SIZE);` maps a region of file directly into memory - it allows us to work with the file as if it were a large array of bytes in memory. This is powerful as it allows us to read and write to the file directly, rather than traditional slow disk operations. The actual mechanics of how the data is transferred between the program and the file are handled by the operating system and although is incredibly efficient, can be subject to things like virtual memory management and paging.

In the while loop that polls for new messages, there is a syncronization mechanism in place `buffer.get(MESSAGE_SIZE - 1) == (byte) 1` where the producer will signal to the consumer that a new message is available by setting the last byte to `1`. The message is then read out of the buffer based on the length of the message and decoded as a string for printing. At the end, the consumer will set `buffer.put(MESSAGE_SIZE - 1, (byte) 0);` to signal to the producer that the massage has been read and is ready for the next message.

```java
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

public class Consumer {

    private static final int MESSAGE_SIZE = 1024;

    public static void main(String[] args) throws Exception {
        try (RandomAccessFile file = new RandomAccessFile("smem.dat", "rw");
             FileChannel channel = file.getChannel()) {

            MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_WRITE, 0, MESSAGE_SIZE);

            while (true) {
                if (buffer.get(MESSAGE_SIZE - 1) == (byte) 1) {
                    int length = buffer.getInt(0);
                    byte[] bytes = new byte[length];
                    buffer.position(4);
                    buffer.get(bytes);
                    String message = new String(bytes);

                    System.out.println("Consumed: " + message);

                    buffer.put(MESSAGE_SIZE - 1, (byte) 0);
                }
            }
        }
    }
}
```

## Producer

The producer in this example is not too different from the consumer. It create a channel to the `RandomAccessFile` called smem.dat and maps it to memory. However, the producer is stateful in the sense it holds an integer value `0` and increments it for every message it recieves. `buffer.clear()` and `buffer.putInt(0, bytes.length);` resets the buffers position handle to the start and `buffer.putInt(0, bytes.length);` is used to write the length of the message at the beginning of the buffer (position 0). This is important because the consumer will need to know how long the message is when it reads it. `buffer.position(4)` moves the buffer position to 4 to write the message - this is because an `int` in Java is 4 Bytes (again, it's the length of the message).

Just like the consumer `buffer.put(MESSAGE_SIZE - 1, (byte) 1);` sets the ready flag to signal to a consumer that a new message is available. `buffer.force();` is finally called to ensure the changes are written to the memory-mapped file as changes are not garunteed to be written until the buffer is garbage collected - which I was surprised to learn, but it's true!

```java
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

public class Producer {

    private static final int MESSAGE_SIZE = 1024;

    public static void main(String[] args) throws Exception {
        try (RandomAccessFile file = new RandomAccessFile("smem.dat", "rw");
             FileChannel channel = file.getChannel()) {

            MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_WRITE, 0, MESSAGE_SIZE);
            int i = 0;

            while (true) {
                String message = "Msg-" + i++;
                byte[] bytes = message.getBytes();

                buffer.clear();
                buffer.putInt(0, bytes.length);
                buffer.position(4); 
                buffer.put(bytes);
                buffer.put(MESSAGE_SIZE - 1, (byte) 1);
                buffer.force();

                System.out.println("Produced: " + message);
            }
        }
    }
}
```

For demonstration purposes, I recorded a tmux session running one producer, and a consumers - the same consumer is split across two windows. It was run on a MacBook Air M1 2020 with 8GB memory running Ventura 13.0.1. 

![ipctmux](https://github.com/pjhampton/pjhampton/assets/8960296/8811ce5a-7a71-405a-8817-05f55a7b4001)
