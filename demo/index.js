var basin = require("../src/interpreter");

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

  // For loop
  {
    FOR: ["i", 1, 10, 1],
    script: [{ PRINT: { i: null } }]
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

basin.run(program);
