---
title: Practical Design Patterns in JavaScript
created: '2023-05-24'
updated: '2023-06-01'
published: false
---

# Practical Design Patterns in JavaScript

Lesson watched on Pluralsight ([link](https://app.pluralsight.com/library/courses/javascript-practical-design-patterns/table-of-contents)).

---

The name came from Christofer Alexander's [A pattern language](https://www.patternlanguage.com/) in the architecture world.

A pattern is a way to solve a problem. The Gang of Four took this analogy and provided some common patterns to solve common developer problems.

A design pattern

-   solves a problem
-   is a proven concept
-   the solution is not obvious (eg. it is not a for loop)
-   it describes a relationship, how things interact
-   it has a significant human component, we have to make it work for our scenario

Types of patterns:

-   Creational (deals with the creation of a new instance of an object): constructor, module, factory, singleton
-   Structural: decorator, facade, flyweight
-   Behavioral: command, mediator, observer

## Creational design patterns

Adapting creation to different situations to create an object.

### Constructor pattern

Create new objects with their own object scope. Usually we want to create more than one objects.

The `new` keyword

-   Creates a new object
-   Links to an object prototype
-   Binds `this` to the new object scope
-   Returns `this` implicitly

Example

```js
function Task(type, description) {
    this.type = type;
    this.description = description;

    this.toString = function () {
        return `${this.type}: ${this.description}`;
    };
}
```

We can do the same with the `class` keyword, as in the next example.

```js
class Task {
    constructor(type, description) {
        this.type = type;
        this.description = description;
    }

    toString() {
        return `${this.type}: ${this.description}`;
    }
}
```

#### Prototype

Encapsulate properties that an object can link to.

Example

```js
function Task(type, description) {
    this.type = type;
    this.description = description;
}

Task.prototype.toString = function () {
    return `${this.type}: ${this.description}`;
};
```

We can do the same with the `class` and `extends` keywords, as in the next example.

```js
class BaseTask {
    toString() {
        return `${this.type}: ${this.description}`;
    }
}

class Task extends BaseTask {
    constructor(type, description) {
        super();

        this.type = type;
        this.description = description;
    }
}
```

> Note: Javascript does not have actual classes, they are transpiled to functions and prototypes under the hood.

### Module pattern

A simple way to encapsulate similar/related functions. We do not want multiple instances, but it is not enforced in some way.

Examples

-   An object literal

```js
const DatabaseService = {
    find() {},
    save() {},
};
```

-   A function

```js
const DatabaseService = function () {
    let aPrivateVariable = 42;
    return {
        find() {},
        save() {},
    };
};
```

-   A module

```js
let aPrivateVariable = 42;
module.exports.DatabaseService = {
    find() {},
    save() {},
};
```

#### Revealing module pattern

A slight variation on the module pattern. The main concept of the revealing module pattern is that all functionality and variables should be hidden unless deliberately exposed.

Example

```js
const DatabaseService = function () {
    let aPrivateVariable = 42;
    function find() {}
    function save() {}
    return {
        find,
        save,
    };
};
```

### Factory pattern

Used to simplify object creation.

Example

```js
const ChoreService = {
    find() {},
};

const BugService = {
    find() {},
};

class TaskFactory {
    getService(type) {
        if (type === 'chore') {
            return ChoreService;
        }
        return BugService;
    }
}
const taskFactory = new TaskFactory();
const choreService = taskFactory.getService('chore');
```

### Singleton pattern

Used to have a single instance of an object.

```js
class TaskFactory {
    constructor() {}
    static getInstance() {
        if (!this.instance) {
            this.instance = new TaskFactory();
        }
        return this.instance;
    }
}
const instance1 = TaskFactory.getInstance();
const instance2 = TaskFactory.getInstance();
// instance1 and instance2 are the same
```

## Structural design patterns
