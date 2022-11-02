---
title: 'Favourite Footguns Pt 3: No resets in Object Pools'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2022-Nov-2'
excerpt: >

---

On the JVM, short-lived objects are inexpensive to allocate and collect. Garbage Collection (GC) is one of those topics engineers celebrate for convenience and safety, which in many cases increases development speed. There are, however, classes of memory-conscious programming where high allocation and GC pauses are undesirable - think Low-Latency Trading and computations on IoT sensor data. Although not a silver bullet solution, Object Pools, a type of creational design pattern, can provide constant time access to objects, increase the overall throughput of the application, and reduce allocation footprint leading to a very different heap profile. They are useful when instantiation is costly - examples include XML Parsers, Video Game Objects, and Database Connections.

In short, Object Pools are a collection of mutable objects that can be dequeued and enqueued rather than creating a new object and discarding it for garbage collection. However, it is easy to footgun the design of the Object Pool by not resetting the resident objects.

### An Example

For this example, I am using **Java 17**, with **Lombok 18** for syntactical convenience. As this post is just to demonstrate how you can shoot yourself in the foot rather than build out something production-grade, we will only be pooling a very simple Object - a Person with two properties (name + age) and a public method to display these properties nicely.

```java
package com.pjhampton.objpool;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
final public class Person {

    // Contrived and simple object to pool
    
    private String name;
    private Integer age;

    public void sayHello() {
        System.out.printf("Hi, I'm %s, and I'm %d!%n%n", name, age);
    }
}
```

Below I create a no-thrills object pool that accepts a generic type. In this blog post, it will just be kept to a Person object though. An ```ArrayDeque<T>``` is used as the internal collection with a create function to build the Pool. The reason why I call this a no-thrills pool is that more sophisticated implementations can resize based on supply and demand parameters (hence the use of ArrayDeque<T> here) and do resetting (which we will get to). On a side note, this object pool has First In First Out (FIFO) semantics, but you could easily make it LIFO, or use a combination of the two (for whatever reason).

```java
package com.pjhampton.objpool;

import lombok.NoArgsConstructor;

import java.util.ArrayDeque;
import java.util.List;

@NoArgsConstructor
final public class Pool<T> {

    private ArrayDeque<T> pool;

    public void create(List<T> objects) {
        pool = new ArrayDeque<>(objects);
    }

    public T fetchOne() {
        return pool.pollFirst();
    }

    public void putOne(T object) {
        pool.addLast(object);
    }
}
```

In the main class, I create a 4-person object pool and run a 100 iteration for loop. This loop sets up the objects properties and uses the sayHello() function to print it's internal state in a friendly way to STDOUT. 

```java
package com.pjhampton.objpool;

import java.util.ArrayList;
import java.util.List;

public class Main {

    final private static Pool<Person> objectPool = new Pool<>();

    private static void initializeObjectPool() {
        List<Person> personList = new ArrayList<>();

        // Add 5 objects to the pool
        for (int i = 0 ; i < 5 ; i++) {
            var person = new Person();
            personList.add(person);
        }

        objectPool.create(personList);
    }

    public static void main(String[] args) {
        initializeObjectPool();

        for (int i = 0 ; i < 100 ; i++) {
            var person = objectPool.fetchOne();

            // Set up Person
            person.setName(String.format("Person %d", i));
            person.setAge(i + 10);

            // Print hash code + person message
            System.out.println(person.hashCode());
            person.sayHello();

            objectPool.putOne(person);
        }
    }
}
```

The printed output looks like so:

```txt
1442407170
Hi, I'm Person 0, and I'm 10!

1028566121
Hi, I'm Person 1, and I'm 11!

1118140819
Hi, I'm Person 2, and I'm 12!

1975012498
Hi, I'm Person 3, and I'm 13!

1808253012
Hi, I'm Person 4, and I'm 14!

1442407170 <-- First object reused again - great success 💅
Hi, I'm Person 5, and I'm 15!

1028566121
Hi, I'm Person 6, and I'm 16!

...
```

### The Footgun

In this example, things can't really go wrong. After all - we are in control of what the Person properties are. We set them to be name = Person $i, and age = $i + 10. But if the data was coming in from an external source that the system doesn't control (which is usually the case in any useful system), we could run into a data issue very quickly. For example, let's assume that every other Person does not have an age. This programs output would start to look like so:

```java
public static void main(String[] args) {
    initializeObjectPool();

    for (int i = 0 ; i < 100 ; i++) {
        var person = objectPool.fetchOne();

        // Set up Person
        person.setName(String.format("Person %d", i));

        // implement bug to skip setting a persons age
        // pretend it is missing on upstream source 😉
        if (i % 2 == 0)
            person.setAge(i + 10);

        // Print hash code + person message
        System.out.println(person.hashCode());
        person.sayHello();

        objectPool.putOne(person);
    }
}
```

There is now an obvious data issue - old data on the objects is being recycled when the object is being taken out of the pool again.

```txt
1442407170
Hi, I'm Person 0, and I'm 10!

1028566121
Hi, I'm Person 1, and I'm null!

1118140819
Hi, I'm Person 2, and I'm 12!

1975012498
Hi, I'm Person 3, and I'm null!

1808253012
Hi, I'm Person 4, and I'm 14!

1442407170 <-- oh boi. We are using the age from Person 1 😅
Hi, I'm Person 5, and I'm 10!

1028566121
Hi, I'm Person 6, and I'm 16!

```

### Solution: In-band or Out-of-Band Resets

The solution is to implement in-band or out-of-band object resets. I can't think of a time when you wouldn't reset, but regretfully I have come across an implementation that didn't and has insprired me to write this post. It's not that straightforward though as resetting could increase latency indirectly - so maybe partial resets are ideal for some pooling strategies.


We can do this reset or zeroing out when we take it from the pool or when we add it back in. 

```java
public interface PoolObject {

    void reset();
}
```

```java
final public class Person implements PoolObject {

    ...
    public void reset() {
        name = null;
        age = null;
    }
}
```

```java
final public class Pool<T extends PoolObject> {

    ...

    // ✅ In Band reset
    public T fetchOne() {
        var obj = pool.pollFirst();
        obj.reset(); // could blow if pool empty
        return obj;
    }

    // ✅ Out of Band reset
    public void putOne(T object) {
        object.reset();
        pool.addLast(object);
    }
}
```

Obviously, you wouldn't do both - but either one should suffice in a lot of use cases. I would be interested in profiling to see if there is much of a difference. I guess that will be for another day.
