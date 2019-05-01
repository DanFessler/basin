# BASIN

A lightweight AST (abstract syntax tree) interpreter built in javascript.  
**BASIN** is an acronym for Basic Abstract Syntax Interpreter.

# Syntax

While BASIN does not include a parser, You can write programs directly in **BASON**.

- A `Program` in BASON is constructed as valid JSON (or Javascript object literal) and contains a script
- A `Script` is an array of expressions to be evaluated.
- An `Expression` is a literal (`string` or `number`), or an object who's key is a keyword (`Command`, `Function`, or `Variable`) and value is its input parameter(s).
- `Parameters` are also an array of expressions. If there's only one parameter, there's no need for the containing array.

# Language Reference

- [Full BASON language reference](language.md)

# Examples

#### Hello World:

```JSON
[
  { "PRINT": "Hello World!" }
]
```

Each program is an array of expressions, and therefore wrapped in square brackets. This script only has one expression, an object whos key is the name of the command, in this case `PRINT`, and we supply it with a string literal which results in the text "Hello World!" printing to the console.

#### Using Variables:

```JSON
[
  { "LET": ["myvar", "World!"] },
  { "PRINT": { "ADD": [ "Hello ", {"myvar": null} ] } }
]
```

In this example we define a variable with the `LET` command which takes two parameters: the name of the variable and its value. We then use the `ADD` function to join the text "Hello " with the value of `myvar` to get "Hello World!" In BASON Script, Variables are referenced as objects with a `null` value.

#### Using Loops:

```JSON
[
  {
    "FOR": ["i", 1, 100, 1],
    "script": [
      { "PRINT": {"i": null} }
    ]
  }
]
```

This program prints the numbers 1 to 10 to the console using the `REPEAT` command. Any command which executes a script such as loops takes a special object property called "script" who's value is a `script` array.

#### Functions:

```JSON
[
  {
    "FUNCTION": ["GREET", "name"],
    "script": [
      { "PRINT": { "ADD": ["Hello ", {"name": null}] } }
    ]
  },
  { "GREET": "Dan" }
]
```

Here we define a new function called `GREET` with an input parameter called `name`. Once it has been defined, we can use it the same as any other command. Presently, functions are not [hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), so you must declare a function before it is used in a script.
Functions are locally scoped, so any variables or functions declared in them will not be accessible outside and will [shadow](https://en.wikipedia.org/wiki/Variable_shadowing) anything of the same name in the outer scope.

# But why?

BASON's syntax is obviously painful to write, so why would you want to use it? Well it has a couple of interesting use cases:

- A safe method of transmitting and executing arbitrary server-side code in a sand-boxed environment.
- BASON's data format is an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree), making it an ideal target interpreter for creating new languages and parsers.

# Installation

```
npm install basin-script --save
```

# Usage

Import the package, define your program, and run it with `Basin.run()`

```javascript
let Basin = require("basin-script");

let program = [
  { LET: ["myvar", "World!"] },
  { PRINT: { ADD: ["Hello ", { myvar: null }] } }
];

Basin.run(program);
```

If you're looking for a simpler syntax, check out the [bason-funky](https://github.com/DanFessler/bason-funky) parser

# Running the Demo

- `npm run demo` will run the example program located in demo/index.js
