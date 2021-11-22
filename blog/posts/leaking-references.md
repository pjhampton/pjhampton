---
title: 'Favourite Footguns Pt 1: Leaking references'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2021-11-22'
excerpt: >
  This post looks at one of my favourite footguns - leaky references. I provide an example in Java 17
  and recreate it in a more functional friendly way. 
---

One annoying design smell I have seen come up a couple of times in different contexts throughout my career is Software Developers leaking references.
This is when an input to an API can change outside its scope and update the state within the API. An example is this wrapper around
a typical data structure. This snippet of code is more or less how Object-Oriented Programming is taught and my IDE pretty much wrote this 
for me. The below examples are programmed with Java 17, but the real-world examples I have seen were not Java bound.

```java
record ListContainer<T>(List<T> list) {

    public Integer size() {
        return list.size();
    }

    public List<T> getList() {
        return list;
    }
}
```

When this API is created it is possible to update the seed array and have that reflected within the ListContainer API. What is worse
is that you can return a new reference of the list to the caller that can in turn make changes upstream. 

```java
public class Application {

    public static void main(String[] args) {

        var seedArray = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        var listContainer = new ListContainer<>(seedArray);
        System.out.println(listContainer.size()); // ==> 5 👍

        seedArray.add(6);
        System.out.println(listContainer.size()); // ==> 6 👎

        seedArray.add(7);
        seedArray.add(8);
        System.out.println(listContainer.size()); // ==> 8 😅

        var internalList = listContainer.getList();
        internalList.add(9);
        System.out.println(listContainer.size()); // ==> 9 😱
    }
}
```

Although it's not always the case, programmers are expected to become more and more polyglot - _using the right tools for the job_.
This means that you could find developers who describe themselves non-specialists in your language of choice working on **your code**.
Providing idiomatic design to your APIs so you don't hand off a footgun to future consumers is to make fuller use of the type
system and follow function programming principles such as _immutability first_.

```java
record ListContainer<T>(List<T> list) {

    ListContainer(List<T> list) {
        this.list = new ArrayList<>(list);
    }

    public Integer size() {
        return list.size();
    }

    public List<T> getList() {
        return Collections.unmodifiableList(list);
    }
}
```

In the above refactor, a copy of the list is made in the constructor, abandoning the reference so it can be changed elsewhere
without downstream impact. Another unfortunate case with the first edition of the ListContainer API is that it can
transitively leak and cause even more chaos in different parts of the system. By returning an Unmodifiable List 
you are returning an immutable view of that collection, requiring a caller to recreate a list if they choose to update it. 

```java
public class Application {

    public static void main(String[] args) {

        var seedArray = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        var listContainer = new ListContainer<>(seedArray);
        System.out.println(listContainer.size()); // ==> 5 👍

        seedArray.add(6);
        System.out.println(listContainer.size()); // ==> 5 👍

        seedArray.add(7);
        seedArray.add(8);
        System.out.println(listContainer.size()); // ==> 5 👍

        var internalList = new ArrayList<>(listContainer.getList());
        internalList.add(9);
        System.out.println(listContainer.size()); // ==> 5 👍
    }
}
```
