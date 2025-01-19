---
title: 'Glossing TypeScript types'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2025-Jan-19'
show_post_footer: true
excerpt: >

---

[General](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) and [utility](https://www.typescriptlang.org/docs/handbook/utility-types.html) types are well documented in TypeScript. I find myself writing a lot of TypeScript, regardless of what I work on, and keeping these at the forefront of my mind typically helps. Some are basic — you can't know TypeScript without knowing these. Others come into play when you find yourself working with code where the type hierarchy is a bit of a mess, and refactoring it would be difficult — usually not the task at hand. This post is nothing more than a glossary. 

## `typeof`

JavaScript already has a `typeof` operator, which can be used in an expression context. TypeScript extends this by inferring types and returning the type context to be used for a variable or property.

```ts
const person = 'Pete';
type Person = typeof Person;
```

## `keyof`

The `keyof` operator takes an object type and returns a string or numeric literal union of its keys. TypeScript automatically creates a type that matches the object's structure. The `keyof` operator gives us a union type of all the object's property names, which is super useful when you need to work with object keys.

```ts
const object = {
    name: 'Bitcoin',
    age: 16
}

type Object = typeof object;
type ObjectKeys = keyof typeof object
```

## Itersection types

Intersection types allow you to combine multiple types into a single type using the `&` operator. In this example, the `Person` type must satisfy both the `HasName` interface (having a `name` property of type `string`) and the `HasAge` interface (having an `age` property of type `number`), effectively creating a type that requires both `name` and `age` properties.

```ts
interface HasName {
    name: string;
}

interface HasAge {
    age: number;
}

type Person = HasName & HasAge;
```

## Nested types

Nested types in TypeScript allow you to define complex object structures with multiple levels of properties, mirroring the way data often exists in real applications. Using bracket notation with nested types (as shown in `NestedObject['user']['info']`) lets you extract specific nested type definitions, which is particularly useful when you need to work with just a portion of a larger type structure.

```ts
type NestedObject = {
    user: {
        info: {
            name: string;
            age: number;
        }
    }
}

type UserInfo = 
    NestedObject['user']['info'];  // { name: string; age: number; }
```

## `Record<T>`

The Record utility type creates an object type where the keys must be of a specific type (often a union of string literals) and the values must conform to another specified type. In this example, it ensures that our `Website` type must have exactly the keys `home`, `about`, and `contact`, and each of these keys must have a value that matches the `PageInfo` structure, making it perfect for mapping a fixed set of keys to a consistent value type.

```ts
type Pages = "home" | "about" | "contact";
type PageInfo = { title: string; content: string };
type Website = Record<Pages, PageInfo>;

const hello: Website = {
    home: {
        title: '...',
        content: '...'
    },
    ...
}
```

## Return types

`ReturnType<T>` is a TypeScript utility type that extracts the return type of a given function type `T`. It's helpful for reusing or enforcing consistency in types derived from function return values.

```ts
const func = () => {
    const val = 'string';
    return val;
}

type Return = 
    ReturnType<typeof func>;
```

`Awaited<T>` is yet another utility type that resolves the type of a value wrapped in a `Promise`. For example, if a function returns `Promise<string>`, Awaited extracts the inner type string. It is particularly useful for asynchronous code when combined with ReturnType.

```ts
const func = async () => {
    const val = 'string';
    return val;
}

type Return = 
    Awaited<ReturnType<typeof func>>;
```

## Function parameter types

The `Parameters` utility type extracts the parameter types of the greet function as a tuple. Since greet accepts two parameters `(name: string and age: number)`, the inferred type of `GreetParams` is `[string, number]`. This is useful for reusing or enforcing consistency with function parameter types.

```ts
function greet(name: string, age: number) {
    return `Hello ${name}, you are ${age} years old`;
}

type GreetParams = Parameters<typeof greet>;
```

### ValueOf

The custom utility type `ValueOf<T>` extracts the values of a given object type `T`. In the below example, `ValueOf<typeof colors>` accesses the `keyof T` (which are the keys of colors: 'red', 'green', and 'blue') to extract the corresponding values `('#ff0000', '#00ff00', '#0000ff')`. This is particularly useful for creating a type from the possible values of an object. I have also seen this called `PropsOf` in some codebases. 

```ts
type ValueOf<T> = T[keyof T];

const colors = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff'
} as const;

type ColorValues = 
    ValueOf<typeof colors>; // '#ff0000' | '#00ff00' | '#0000ff'
```

### `Prettify<T>`

The `Prettify<T>` custom utility type is a helpful trick in TypeScript used to "flatten" or "clean up" the display of complex or intersection types in IDEs and tools. Without Prettify, when types like NestedType are created using intersections (e.g., MainType & { isDeveloper: boolean }), the IDE might display the type as an unwieldy combination of its parts. By applying Prettify<T>, the type is reconstructed as a clean, key-value mapped object, making it easier to read and understand. It doesn't change the behavior of the type, just its appearance.

```ts
interface MainType {
    name: string;
    age: number;
}

type NestedType = MainType & {
    isDeveloper: boolean;
}

type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}
```

### `Partial<T>`

The `Partial<T>` utility type creates a new type where all properties of the given type `T` are optional. In this example, `Partial<Todo>` generates a type where both title and description from the Todo interface are optional `({ title?: string; description?: string; })`. This is useful when you need to work with objects that may only have some of the properties defined, such as when creating an object incrementally, or partial editing.

```ts
interface Todo {
    title: string;
    description: string;
}

type PartialTodo = 
    Partial<Todo>;
```

### `Required<T>`

The opposite of `Partial<T>`. The `Required<T>` utility type makes all properties of the given type `T` mandatory. In this example, `Required<Config>` converts the optional properties of the Config interface into required ones, resulting in `{ name: string; timeout: number; debug: boolean; }`. Useful when you want to ensure that all properties of an object are explicitly defined.

```ts
interface Config {
    name?: string;
    timeout?: number;
    debug?: boolean;
}

type RequiredConfig = Required<Config>;
```

### `Omit<T, K>` 

The `Omit<T, K>` utility type creates a new type by removing the specified keys `K` from the given type `T`. In this example, `Omit<Todo, 'description'>` removes the description property from the Todo interface, resulting in a type with only `{ title: string; }`. This is useful when you want to exclude certain properties from an existing type to create a more specific version. If you want to omit multiple properties you pass a union type like `Omit<Todo, 'title' | 'description'>`

```ts
interface Todo {
    title: string;
    description: string;
}

type OmmitedTodo = 
    Omit<Todo, 'description'>;
```

#### `Pick<T, K>`

The `Pick<T, K>` utility type creates a new type by selecting only the specified keys `K` from the given type `T`. In this example, `Pick<User, 'id' | 'name'>` selects only the id and name properties from the `User` interface, resulting in `{ id: number; name: string; }`. This is useful when you want to create a more focused type that includes only a subset of an existing types properties.

```ts
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

type PublicUser = 
    Pick<User, 'id' | 'name'>;
```

#### `Exclude<T, U>`

`Exclude<T, U>` creates a new type by removing all members of the union `T` that are assignable to `U`. In this example, `Exclude<Shapes, { kind: "circle" }>` removes the shape with kind: `circle` from the `Shapes` union type, leaving only `{ kind: "square", x: number; }`. This is useful when you want to filter out specific variants or members from a union type.

```ts
type Shapes =
  | { kind: 'circle', radius: number }
  | { kind: 'square', x: number };

type FromExcluded = Exclude<Shapes, { kind: "circle" }>;
```

### `Extract<T, U>`

The `Extract<T, U>` utility creates a new type by extracting only the members of type `T` that are assignable to type `U`. In this example, `Extract<Animal, 'cat' | 'dog'>` filters the Animal union type, returning only the types that are part of both `Animal` and `'cat' | 'dog'`, which results in `'cat' | 'dog'`. This is useful when you want to select a subset of types that overlap between two types or unions.

```ts
type Animal = 'cat' | 'dog' | 'bird';
type Pets = Extract<Animal, 'cat' | 'dog'>;  // 'cat' | 'dog'
```

## Conditional types

Conditional types allow you to define types that depend on a condition, using the syntax `T extends U ? X : Y`. This evaluates the type `T` against `U`, and if it extends `U`, the result is `X; otherwise, it is Y`.

In this example, `IsString<T>` is a conditional type that checks whether `T` extends `string`. If `T` is a `string`, it resolves to `true`; otherwise, it resolves to `false`. For type `A = IsString<string>`, the result is `true` because string extends `string`. For `type B = IsString<number>`, the result is `false` because `number` does not extend `string`.

Conditional types are powerful for creating flexible and type-safe logic based on type relationships.

```ts
type IsString<T> = 
    T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
```

## Mapped types

Mapped types allow you to create new types by transforming the properties of an existing type. In the example, the `Readonly<T>` mapped type iterates over all the properties of `T` and makes them `readonly`. This means that the properties of `Readonly<T>` cannot be reassigned after they are initialized.

In this case, `Readonly<Todo>` creates a new type where all properties of the `Todo` interface (title and description) become readonly, making it impossible to modify these properties after the object is created. The resulting type `ReadonlyTodo` has the same structure as `Todo`, but its properties are now immutable, i.e., readonly title: string; readonly description: string;.

Mapped types are a powerful way to dynamically create new types based on existing ones while transforming their properties, like making them readonly, optional, or adding specific transformations.

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

interface Todo {
    title: string;
    description: string;
}

type ReadonlyTodo = 
    Readonly<Todo>;
```

## Types for state representation

Discriminated Unions are a powerful pattern for type-safe state representation, where you define a union of types that each include a common discriminant property (often called a "tag" or "status"). This discriminant allows you to safely handle different states, ensuring that you always know which variant you're dealing with.

In the example, LoadingState, SuccessState, and ErrorState each have a status property with a unique string value ('loading', 'success', or 'error'). The State type is a discriminated union of these three types. The status property acts as the discriminant, so TypeScript can narrow down the type based on its value. For example, when the status is 'loading', TypeScript knows that the type is LoadingState; when the status is 'success', it knows the type is SuccessState and so on.

This approach enables type-safe handling of different states in your application, ensuring that when you access properties like data or error, they are only available when appropriate (e.g., data is only accessible in SuccessState).

Discriminated unions are especially useful for managing different states in applications, like loading, success, and error states, providing clear and type-safe handling of these states.

```ts
type LoadingState = {
    status: 'loading';
}
type SuccessState = {
    status: 'success';
    data: string;
}
type ErrorState = {
    status: 'error';
    error: Error;
}

type State = LoadingState | SuccessState | ErrorState;
```

### Recursive Types 

Recursive Types are types that reference themselves, allowing you to represent nested or hierarchical data structures. This pattern is useful when you need to model structures that can have arbitrary levels of depth, such as trees or nested arrays.

In the example, `NestedArray<T>` is a recursive type that can be either the base type `T` or an array of `NestedArray<T>`. This allows you to create deeply nested structures, such as `number, number[], number[][]`, and so on. In the case of the example variable, it is a nested array of numbers with an arbitrary depth, specifically `[1, [2, [3]]]`, which fits the structure of NestedArray<number>.

```ts
type NestedArray<T> = T | Array<NestedArray<T>>;
// Can be: number, number[], number[][], etc.
const example: NestedArray<number> = [1, [2, [3]]];
```

### `ConstructorParameters<T>`

`ConstructorParameters<T>` is a TypeScript utility type that extracts the parameter types of a class constructor. This is useful when you want to work with or infer the parameters required to instantiate a class without needing to manually extract them.

In the example, `ConstructorParameters<typeof Person>` extracts the parameter types from the Person class's constructor, which are `name: string` and `age: number`. The resulting type `PersonConstructorParams` becomes a tuple type: `[name: string, age: number]`. This allows you to easily infer or use the constructor parameters in contexts such as function signatures, factory functions, or other type manipulations related to class instantiation.

`ConstructorParameters<T>` is helpful when you want to access or manipulate constructor argument types dynamically, making it a powerful tool when working with classes and object construction.

```ts
class Person {
    constructor(name: string, age: number) {}
}

type PersonConstructorParams = ConstructorParameters<typeof Person>;
// [name: string, age: number]
```


### Tuple types with labels

Tuple Types with Labels allow you to create tuples where each element has a named label, improving code readability and clarity by providing context to each element in the tuple.

```ts
type Point = [x: number, y: number];
type RGB = [r: number, g: number, b: number];
```

The `Point` type is a tuple where the first element is labeled `x` (representing the x-coordinate) and the second element is labeled `y` (representing the y-coordinate). While tuples in TypeScript are typically used for fixed-length arrays, adding labels to the elements helps clarify their purpose, making it easier to understand how the values are intended to be used.

This feature is especially useful in cases where tuples represent structured data (like coordinates or pairs of values), and having the labels enhances the type safety and self-documentation of your code.

