---
title: Practical Design Patterns in JavaScript
created: '2023-05-24'
updated: '2023-06-25'
published: false
---

Lesson watched on Pluralsight ([link](https://app.pluralsight.com/library/courses/javascript-practical-design-patterns/table-of-contents)).

The name came from Christofer Alexander's ["A pattern language"](https://www.patternlanguage.com/) in the architecture world.

A pattern is a way to solve a problem. The Gang of Four took this analogy and provided some common patterns to solve common developer problems.

A design pattern

-   Solves a problem
-   Is a proven concept
-   Does not describe an obvious solution (eg. it is not a for loop)
-   Describes a relationship, how things interact
-   Has a significant human component, we have to make it work for our scenario

Some types of patterns are:

-   Creational: constructor, module, factory, singleton
-   Structural: decorator, facade, flyweight
-   Behavioral: command, mediator, observer

## Creational design patterns

Adapting object creation to different situations to increase flexibility and code reuse.

### Constructor pattern

Create new objects with their own object scope. Usually we want to create more than one objects.

The `new` keyword:

-   Creates a new object
-   Links to an object prototype
-   Binds `this` to the new object scope
-   Returns `this` implicitly

Example

```js
function Task(type, description) {
    this.type = type;
    this.description = description;
    this.completed = false;

    this.complete = function () {
        this.completed = true;
    };
}

const task = new Task('enhancement', 'Learn design patterns');
task.complete();
```

We can do the same with the `class` keyword.

**Note**: Javascript does not have actual classes, they are transpiled to functions and prototypes under the hood.

```js
class Task {
    constructor(type, description) {
        this.type = type;
        this.description = description;
        this.completed = false;
    }

    complete() {
        this.completed = true;
    }
}

const task = new Task('enhancement', 'Learn design patterns');
task.complete();
```

#### Prototype

This is a way to create objects by defining a prototype object that serves as a blueprint. It allows us to add properties and methods to the prototype, which are then inherited by all instances created from it. Basically, we can encapsulate properties that an object can link to.

Example

```js
function Task(type, description) {
    this.type = type;
    this.description = description;
    this.completed = false;
}

Task.prototype.complete = function () {
    this.completed = true;
};

const task = new Task('enhancement', 'Learn design patterns');
task.complete();
```

### Module pattern

A simple way to encapsulate similar/related functions. Using this patttern, we do not want multiple instances of an object, but it is not enforced in some way.

Examples

```js
// An object literal
const DatabaseService = {
    find() {},
    save() {},
};
```

```js
// A function
const DatabaseService = function () {
    let aPrivateVariable = 42;

    return {
        find() {},
        save() {},
    };
};
```

```js
// A module
let aPrivateVariable = 42;

module.exports.DatabaseService = {
    find() {},
    save() {},
};
```

### Revealing module pattern

A slight variation on the module pattern. The main concept of the revealing module pattern is that all functionality and variables should be hidden unless deliberately exposed. By looking at the return statement we can easily see what is exposed.

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

This pattern acts as a central factory that handles the creation of objects based on specific conditions or parameters. It provides a way to create objects without specifying their class or type explicitly.

Example

```js
class Feature {
    constructor() {
        this.type = 'feature';
    }
}

class Bug {
    constructor() {
        this.type = 'bug';
    }
}

class TaskFactory {
    getTask(type) {
        switch (type) {
            case 'feature':
                return new Feature();
            case 'bug':
                return new Bug();
            default:
                throw new Error(`Unknown type: ${type}`);
        }
    }
}

const taskFactory = new TaskFactory();
const feature = taskFactory.getTask('feature');
```

### Singleton pattern

This is a pattern that lets us ensure that a class has only one instance, while providing a global access point to this instance.

```js
class TaskFactory {
    constructor() {
        if (TaskFactory.instance) {
            return TaskFactory.instance;
        }

        TaskFactory.instance = this;
    }
}

const instance1 = new TaskFactory();
const instance2 = new TaskFactory();
instance1 === instance2; // true
```

## Structural design patterns

Concerned with relationships between objects. Their goal is to either extend or simplify their functionality.

### Decorator pattern

With this pattern we can add functionality to an object without being obtrusive. It lets us attach new behaviour, by wrapping the original.
This pattern allows us to have extended functionality and it can be used to not break the existing functionality.

Example

```js
class Task {
    constructor(description) {
        this.description = description;
    }

    save() {
        console.log('Saving task: ', this.description);
    }
}

class UrgentTask extends Task {
    constructor(task) {
        super(`Urgent: ${task.description}`);
        this.task = task;
    }

    save() {
        this.task.save();
        console.log('Urgent task: Also notified users');
    }
}

const task = new Task('Read a book');
task.save();

const urgentTask = new UrgentTask(task);
urgentTask.save();
```

### Facade pattern

Provides a simpler interface to a more complicated system.

Example

```js
class Task {
    constructor(description) {
        this.description = description;
    }
}

const task = new Task('Read a book');

const TaskService = {
    complete(task) {
        task.completed = true;
    },
    save(task) {},
    setCompletionDate(task) {},
    notifyCompletion(task) {},
};

// Some complicated logic
TaskService.complete(task);
if (task.completed) {
    TaskService.setCompletionDate(task);
    TaskService.notifyCompletion(task);
    TaskService.save(task);
}

const TaskServiceFacade = {
    // Extract the complicated logic
    completeAndNotify(task) {
        TaskService.complete(task);
        if (task.completed) {
            TaskService.setCompletionDate(task);
            TaskService.notifyCompletion(task);
            TaskService.save(task);
        }
    },
};

TaskServiceFacade.completeAndNotify(task);
```

### Flyweight pattern

Helps conserve memory by sharing common parts of state between multiple objects instead of keeping all of the data in each object.

**Note**: Only useful when we have a lot of objects.

```js
class Task {
    constructor({ name, user, project, priority }) {
        this.name = name;
        this.user = user;
        this.project = project;
        this.priority = priority;
    }
}

class Flyweight {
    constructor({ project, priority, user }) {
        this.project = project;
        this.priority = priority;
        this.user = user;
    }
}

const FlyweightFactory = {
    flyweights: {},
    getFlyweight({ project, priority, user }) {
        const key = `${project}-${priority}-${user}`;

        if (!this.flyweights[key]) {
            this.flyweights[key] = new Flyweight({ project, priority, user });
        }

        return this.flyweights[key];
    },
    countFlyweights() {
        return Object.keys(this.flyweights).length;
    },
};

class FlyweightTask {
    constructor({ name, user, project, priority }) {
        this.name = name;
        this.flyweight = FlyweightFactory.getFlyweight({
            project,
            priority,
            user,
        });
    }
}

const getTaskService = ({ type }) => ({
    tasks: {},
    createTask({ id, ...data }) {
        const task = type === 'task' ? new Task(data) : new FlyweightTask(data);
        this.tasks[id] = task;
    },
    countTasks() {
        return Object.keys(this.tasks).length;
    },
});

const TaskService = getTaskService({ type: 'task' });
const FlyweightTaskService = getTaskService({ type: 'flyweight' });

const NUM_OF_TASKS = 1000000;
const USERS = ['user 1', 'user 2', 'user 3', 'user 4'];
const PROJECTS = ['project 1', 'project 2', 'project 3'];
const PRIORITIES = ['low', 'medium', 'high'];

const initialMemory = process.memoryUsage().heapUsed;

for (let i = 0; i < NUM_OF_TASKS; i++) {
    TaskService.createTask({
        id: i,
        name: `task ${i}`,
        user: USERS[Math.floor(Math.random() * 4)],
        project: PROJECTS[Math.floor(Math.random() * 3)],
        priority: PRIORITIES[Math.floor(Math.random() * 3)],
    });
}

const finalMemory = process.memoryUsage().heapUsed;
const usedMemory = (finalMemory - initialMemory) / 1000000;

console.log('TaskService');
console.log(`${TaskService.countTasks()} tasks created`);
console.log(`Used memory: ${usedMemory} MB`);
console.log('-----------------------------------');

const initialMemoryFlyweight = process.memoryUsage().heapUsed;

for (let i = 0; i < NUM_OF_TASKS; i++) {
    FlyweightTaskService.createTask({
        id: i,
        name: `task ${i}`,
        user: USERS[Math.floor(Math.random() * 4)],
        project: PROJECTS[Math.floor(Math.random() * 3)],
        priority: PRIORITIES[Math.floor(Math.random() * 3)],
    });
}

const finalMemoryFlyweight = process.memoryUsage().heapUsed;
const usedMemoryFlyweight =
    (finalMemoryFlyweight - initialMemoryFlyweight) / 1000000;

console.log('FlyweightTaskService');
console.log(`${FlyweightTaskService.countTasks()} tasks created`);
console.log(`${FlyweightFactory.countFlyweights()} flyweights created`);
console.log(`Used memory: ${usedMemoryFlyweight} MB`);
```
