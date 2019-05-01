# BASON Language reference

BASON is a work in progress and the core language is still being developed.

### Assignment operators

- `{ "SET": [var, value] }` Assign value to variable
- `{ "INC": var }` Increment value of variable

### Arithmetic operators

- `{ "ADD": [a, b] }` Addition
- `{ "SUB": [a, b] }` Subtraction
- `{ "MUL": [a, b] }` Multiplication
- `{ "DIV": [a, b] }` Division
- `{ "MOD": [a, b] }` Modulus

### Comparison operators

- `{ "==": [a, b] }` Equal to
- `{ "<>": [a, b] }` Not equal
- `{ ">" : [a, b] }` Greater than
- `{ "<" : [a, b] }` Less than
- `{ ">=": [a, b] }` Greater than or equal to
- `{ "<=": [a, b] }` Less than or equal to

### Logical operators

- `{ "AND": [a, b] }` returns `true` if both a and b are true
- `{ "OR" : [a, b] }` returns `true` if either a or b is true

### Statements

- `{ "LET": [name, value] }`  
  Declares a variable

- `{ "PRINT": string }`  
  Prints a string to the console

- `{ "IF": condition, script: [script...] }`  
  Executes a block of statements if condition is met

* `{ "FOR": [variable, start, end, step], script: [script...] }`  
  Loops over a block of statements a specified number of times

- `{ "WHILE": condition, script: [script...] }`  
  Loops over a block of statements while condition is true

* `{ "FUNCTION": [name, params...], script: [script...] }`  
  Declares a function

- `{ "RETURN": value }`  
  Returns a value from a function and exits
