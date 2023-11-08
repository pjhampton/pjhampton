---
title: 'Rust borrow checker notes'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2023-Nov-8'
show_post_footer: true
excerpt: >
  
---

In C++, a programmer must explicitly allocate and free memory. Around C++11/C++14 the concept of smart pointers were enhanced with `std::shared_ptr` and `std::unique_ptr` to allocate in the _Resource acquisition is initialization_ paradigm (RAII). This is a *runtime* construct that allows the deleter to be called once the the last pointer of that object goes out of scope - they perform this memory management by automatically tracking references. This is helpful for dealing with dangling pointers and other memory leaks caused by not freeing up heap. 

```cpp
#include <iostream>
#include <memory>
#include <string>

class Person {

public:
    Person() : name("Nobody") {}
    Person(const std::string& seedName) : name(seedName) {}

    void setName(const std::string& newName) {
        name = newName;
    }

    void greet() {
        std::cout << "Hello " << name << std::endl;
    }

private:
    std::string name;
};
```


```cpp
int main() {

    std::unique_ptr<Person> person = std::make_unique<Person>();
    person->setName("Emily");
    person->greet();

    // deleter called

    return 0;
}
```

When I first heard about Rust and the Borrow Checker I thought it sounded very similar to the above - C++ smart pointers. Conceptually, they seem to serve similar purposes but take memory safety to another level with static typing and compile-time checks. 

## Rust

The [Rust programming langauge](https://www.rust-lang.org/) does things a little differently and manages memory through concept of _ownership_ and _borrowing_. Even though I have experience with smart pointers and move semantics in C++, I still found the concepts of the Rust Borrow checker to be a little tricky to grok. In summary:

- **Ownership**: Each value in Rust has a single "owner", ensuring safe memory management.
- **Borrowing**: Values can be borrowed either mutably or immutably.
- **Exclusive Mutability**: You can have either one mutable reference or multiple immutable references to a value, but not both. This helps with thread-safety.
- **Scope-based Lifetimes**: References to values cannot outlive the values they point to.
- **Compile-time**: The borrow checker operates at compile time, ensuring no runtime overhead while maintaining safety.

### Example 1

In this first example I create a mutable string `s` and create 2 immutable borrows by referencing the string. This is legal as it can't be changed. However, if I were to borrow it as a mutable reference, the borrow checker would fail. I can create a mutable reference to the variable after immutable references are no longer in scope. 

```rust
fn main() {
    let mut s = String::from("Emily");

    let r1 = &s; // Immutable borrow.
    let r2 = &s; // Immutable borrow.

    // let r3 = &mut s; // Error! Can't borrow `s` as mutable because it's already borrowed as immutable.

    println!("{} / {}", r1, r2);

    // r1 and r2 are no longer used after this point.

    let r3 = &mut s; // Mutable borrow is allowed now.
    println!("{}", r3);
}
```

To carry on from this example you can have one mutable reference to a variable, and once that goes out of scope it is possible to create another mutable reference.

```rust
fn main() {
    let mut s = String::from("Emily");

    let r1 = &mut s;  // First mutable borrow starts here.
    // let r2 = &mut s;  // Error! Can't have two mutable borrows at once.

    println!("{}", r1);

    let r2 = &mut s;  // This is allowed as the first mutable borrow ended.
    println!("{}", r2);
}
```

### Example 2

In this next example, the borrow checker prevents me from pushing an integer to a vector once an immutable reference to `nums` is created. This prevents a separate part of the program from mutating the structure from another part of the program, potentially facing awkward race conditions or data corruption. One the reference goes out of scope the caller can mutate the vector.

```rust
fn main() {
    let mut nums = vec![1, 2, 3, 4, 5];

    let first = &nums[0];  // Immutable borrow starts.

    // nums.push(6); // Error! Can't mutate `nums` while it's borrowed.

    println!("First number: {}", first);

    nums.push(6);  // It's okay now to mutate `nums` as the borrow has ended.
}
```

### Example 3

In this example the borrow checker prohibits iterating over an array and mutating it at the same time. I can't think of a time when someone would do this - as it seems pretty dumb. But it's nice to know this can be caught at compile time and probit the developer from doing this in the first place.

```rust
#[allow(unused_mut)]

fn main() {
    let mut vector = vec![1, 2, 3, 4, 5, 6];

    for n in &vector {
        // Error! Can't mutate `vector` while it's being iterated over immutably.
        // vector.push(7);
        println!("{}", n);
    }
}
```

### Example 4

This is a slightly more contrived example, but I believe it could happen if you were writing Rust with an imperitive mindset. A `struct Person` is created with a `get_name` function that returns the name property. However, within a local scope, the `name` property reference cannot outlive the `Person struct` instance, and therefore hoisting the value to a higher scope wouldn't happen.

```rust
struct Person {
    name: String,
}

fn get_name<'a>(person: &'a Person) -> &'a str {
    &person.name
}

fn main() {
    let name;
    {
        let person = Person { name: String::from("Emily") };
        name = get_name(&person);
        println!("{}", name)

        // Error! `name` outlives `person`. 
        // Thus, the reference held by `name` would be dangling.
    }
    
    // println!("{}", name); // would never happen
}
```

## Final thoughts

This surface look at the Rust borrow checker is pretty interesting - I particullary like the compiler output when there are referencing issues. It's clear that simple, but common manual memory-management issues in C/C++ are addressed by the borrow checker such as null pointer deferencing, data races and dangling pointers. The overall syntax and package management of the language is also very refreshing. I get the hype.
