const basin = require("../src/interpreter");

// Load in custom functions plugin
basin.import({
  FOOBAR: input => {
    console.log(`foobar: ${input}`);
  }
});

let program = [
  // Custom function
  {
    FUNCTION: ["GREET", "name"],
    script: [{ PRINT: { ADD: ["Hello ", { name: null }] } }]
  },
  { GREET: "World!" },

  // Nested for loop
  {
    FOR: ["y", 1, 3, 1],
    script: [
      {
        FOR: ["x", 1, 3, 1],
        script: [{ PRINT: { ADD: [{ ADD: [{ x: null }, ","] }, { y: null }] } }]
      }
    ]
  },

  // While loop
  { SET: ["i", 0] },
  {
    WHILE: null,
    script: [
      [{ "<": [{ i: null }, 20] }],
      [{ PRINT: { i: null } }, { SET: ["i", { ADD: [{ i: null }, 1] }] }]
    ]
  },

  // Plugin functions
  {
    FOOBAR: "test"
  }
];

let program1 = [
  {
    FUNCTION: ["GREET", "name"],
    script: [
      { DIM: ["arr", 3] },
      { SET: ["arr", 0, "hello world!"] },
      { SET: ["arr", 1, "hello cheese!"] },
      { SET: ["arr", 2, "hello poop!"] },
      // { PRINT: { arr: 1 } }
      {
        FOR: ["i", 0, 2, 1],
        script: [{ PRINT: { arr: { i: null } } }]
      }
    ]
  },
  { GREET: "World!" },
  { PRINT: "this is test done" }
];

let program2 = [
  { DIM2: ["myArray", 3, 3] },
  // { DUMP: "myArray" }
  // { TEST: "myArray" },
  // { DUMP: "myArray" }
  { SET: ["i", 1] },
  {
    FOR: ["y", 0, 2, 1],
    script: [
      {
        FOR: ["x", 0, 2, 1],
        script: [
          { SET: ["myArray", { x: null }, { y: null }, { i: null }] },
          { INC: "i" }
        ]
      }
    ]
  },
  { DUMP: "myArray" },
  {
    FOR: ["y", 0, 2, 1],
    script: [
      {
        FOR: ["x", 0, 2, 1],
        script: [
          // { PRINT: [{ x: null }, ",", { y: null }] },
          { PRINT: { myArray: [{ x: null }, { y: null }] } }
        ]
      }
    ]
  }
];

basin.start(program2);
