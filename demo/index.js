var interpreter = require('../src/interpreter')

let program = [
  {
    "FUNCTION": ["GREET", "name"],
    "script": [
      { "PRINT": { "ADD": ["Hello ", {"name": null}] } }
    ]
  },
  { "GREET": "World!" }
]

interpreter.RUN(program);
