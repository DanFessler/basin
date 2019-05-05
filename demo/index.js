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

basin.start(program);
