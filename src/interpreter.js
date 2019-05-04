// Script is an array of expressions to be evaluated
// parameters are also an array of expressions
// if only one expression, no need for the array
// if expression is a literal, no need for the object

let update = true;

interpreter = {
  run: function(script, delay, Gen) {
    if (!Gen) {
      Gen = this.SCRIPT(script);
      console.log("RUN");
    }

    let result = Gen.next();
    // console.log(JSON.stringify(result));
    if (!result.done) {
      if (delay) {
        // console.log("DELAY", result.value);
        setTimeout(this.run.bind(this, script, delay, Gen), delay);
      } else {
        if (!typeof window) {
          // console.log("ANIMATION");
          window.requestAnimationFrame(this.run.bind(this, script, null, Gen));
        } else {
          // console.log("IMMEDIATE");
          setImmediate(this.run.bind(this, script, null, Gen));
        }
      }
    } else {
      console.log("done");
    }
  },

  runCommand: function*(command) {
    // Attempt to run the function
    let result = command();

    // if we got back a generator, run it
    if (result && result.next) {
      result = yield* command();
    }

    return result;
  },

  SCRIPT: function*(script, init) {
    // Mark where the new memory stack begins
    var stackindex = this.Stack.length;

    // run any initialization inside the new stack
    // this includes local function variables, etc
    if (init) init();

    // iterate over the script
    for (var i = 0; i < script.length; i++) {
      script[i] = yield* this.EVAL(script[i]);
    }

    // pop the memory stack back to where it was
    this.Stack.splice(stackindex);

    // return an array of evaluated expressions
    return script;
  },

  import: function(plugin) {
    Object.keys(plugin).forEach(key => {
      this.Stack.push({ [key]: plugin[key] });
    });
  },

  FIND: function(keyword, showError) {
    // iterate through all the keywords in the stack
    // starting from the end until we find a match
    for (var i = this.Stack.length - 1; i >= 0; i--) {
      if (keyword in this.Stack[i]) {
        return this.Stack[i];
      }
    }

    // if no match was found, log an error
    if (showError) console.error(`KEY NOT FOUND: '${keyword}'`);

    return null;
  },

  EVAL: function*(expression, init) {
    // if expression is literal, return itself as the value
    if (!expression || typeof expression != "object") return expression;

    // if expression is a script, run it
    if (Array.isArray(expression)) {
      return yield* this.SCRIPT(expression.slice(), init);
    }

    // Otherwise...

    // Get keyword and parameters. Evaluate params and ensure it is an array
    var keyword = Object.keys(expression)[0];
    var params = yield* this.EVAL(expression[keyword]);
    params = Array.isArray(params) ? params : [params];

    // if a script exists for this expression, add it to params (without evaluating)
    if ("script" in expression) {
      params.push(expression.script);
    }

    // Execute keyword from the stack with the computed params
    var match = this.FIND(keyword, true);
    if (match) {
      return typeof match[keyword] == "function"
        ? yield* this.runCommand(match[keyword].bind(this, ...params))
        : match[keyword];
    }

    return;
  },

  Stack: [
    {
      LET: function(key, value) {
        var obj = {};
        obj[key] = value;
        this.Stack.push(obj);
      }
    },

    {
      FUNCTION: function(key) {
        var args = Array.prototype.slice.call(arguments);
        var params = args.slice(1, args.length - 1);
        var script = args[args.length - 1];

        var obj = {};
        obj[key] = function*() {
          try {
            yield* this.EVAL(
              script,
              function(key, value) {
                for (let i = 0; i < key.length; i++) {
                  this.FIND("LET")["LET"].bind(this)(key[i], value[i]);
                }
              }.bind(this, params, [...arguments])
            );
          } catch (value) {
            return value;
          }
        };

        this.Stack.push(obj);
      }
    },
    {
      RETURN: function(value) {
        throw value;
      }
    },

    // Assignment operators
    {
      SET: function(key, value) {
        var variable = this.FIND(key);

        // if no variable was found in the stack, define one
        if (variable == null) {
          this.Stack.push({ [key]: value });
          variable = this.FIND(key);
        }

        variable[key] = value;
      }
    },
    {
      INC: function(key) {
        var variable = this.FIND(key);
        variable[key]++;
      }
    },

    // Arithmetic operators
    {
      ADD: function(A, B) {
        return A + B;
      }
    },
    {
      SUB: function(A, B) {
        return A - B;
      }
    },
    {
      MUL: function(A, B) {
        return A * B;
      }
    },
    {
      DIV: function(A, B) {
        return A / B;
      }
    },
    {
      MOD: function(A, B) {
        return A % B;
      }
    },

    // Relational operators
    {
      "==": function(A, B) {
        return A == B;
      }
    },
    {
      "<>": function(A, B) {
        return A != B;
      }
    },
    {
      ">": function(A, B) {
        return A > B;
      }
    },
    {
      "<": function(A, B) {
        return A < B;
      }
    },
    {
      ">=": function(A, B) {
        return A >= B;
      }
    },
    {
      "<=": function(A, B) {
        return A <= B;
      }
    },

    // Logical operators
    {
      AND: function(A, B) {
        return A && B;
      }
    },
    {
      OR: function(A, B) {
        return A || B;
      }
    },

    {
      PRINT: function() {
        var string = "";
        for (var i = 0; i < arguments.length; i++) {
          string += arguments[i] != null ? arguments[i] : "";
        }
        console.log(string);
      }
    },
    {
      FOR: function*(key, start, end, step, script) {
        let variable = { [key]: start };
        this.Stack.push(variable);
        for (null; variable[key] <= end; variable[key] += step ? step : 1) {
          yield* this.EVAL(script);
          if (update) yield;
        }
      }
    },
    {
      IF: function*(condition, script) {
        if (condition) {
          yield* this.EVAL(script[0]);
        } else {
          if (script[1]) yield* this.EVAL(script[1]);
        }
      }
    },
    {
      WHILE: function*(condition, script) {
        while (yield* this.EVAL(script[0][0])) {
          yield* this.EVAL(script[1]);
          if (update) yield;
        }
      }
    },

    {
      SUSPENDUPDATE: function() {
        update = false;
      }
    },
    {
      RESUMEUPDATE: function() {
        update = true;
      }
    },
    {
      UPDATE: function*() {
        yield;
      }
    }
  ]
};

module.exports = interpreter;
