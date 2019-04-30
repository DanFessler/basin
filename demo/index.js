var interpreter = require("../src/interpreter");

let program = [
  {
    FUNCTION: ["FUNC", "name"],
    script: [
      {
        IF: { "==": [{ name: null }, "Dan"] },
        script: [{ RETURN: "You found Dan!" }]
      },
      {
        IF: { "<>": [{ name: null }, "Dan"] },
        script: [{ RETURN: "You didn't find Dan!" }]
      }
    ]
  },
  { PRINT: { FUNC: "Dan" } }
];

interpreter.RUN(program);
