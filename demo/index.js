var interpreter = require('../src/interpreter')

let program = [
  { LET: ["myvar", "World!"] },
  { PRINT: { ADD: [ "Hello ", {myvar: null} ] } }
]

interpreter.RUN(program);
