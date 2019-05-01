var basin = require("../src/interpreter");

let program = [
  {
    FUNCTION: ["GREET", "name"],
    script: [{ PRINT: { ADD: ["Hello ", { name: null }] } }]
  },
  { GREET: "World!" },

  {
    FOR: ["i", 1, 10, 1],
    script: [{ PRINT: { i: null } }]
  },

  { SET: ["i", 0] },
  {
    WHILE: null,
    script: [
      [{ "<": [{ i: null }, 20] }],
      [{ PRINT: { i: null } }, { SET: ["i", { ADD: [{ i: null }, 1] }] }]
    ]
  }
];

basin.run(program);
