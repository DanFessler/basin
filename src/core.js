module.exports = {
  TEST: function() {
    console.log(this.test());
  },
  LET: function(key, value) {
    var obj = {};
    obj[key] = value;
    this.Stack.push(obj);
  },
  DIM: function(key, size, value) {
    var obj = {};
    obj[key] = Array(size);
    obj[key].fill(value);
    this.Stack.push(obj);
  },
  TEST: function(key) {
    var variable = this.find(key);
    variable[key][0][0] = "poop";
  },
  DIM2: function(key) {
    var args = Array.prototype.slice.call(arguments);
    var size = args.slice(1, args.length);
    // var value = args[args.length - 1];

    var obj = {};
    obj[key] = makeArray(size);
    this.Stack.push(obj);

    // TODO:
    // this is where I left off
    // trying to fix an issue where each row was referring to the same object
    function makeArray(size) {
      let arr = [...Array(size[0])];
      if (size.length > 1) {
        arr.forEach(function(e, i) {
          arr[i] = makeArray(size.slice(1));
        });
      } else {
        arr.fill(null);
      }
      return arr;
    }
  },
  FUNCTION: function(key) {
    var args = Array.prototype.slice.call(arguments);
    var params = args.slice(1, args.length - 1);
    var script = args[args.length - 1];

    var obj = {};
    obj[key] = function*() {
      try {
        yield* this.evaluate(
          script,
          function(key, value) {
            for (let i = 0; i < key.length; i++) {
              this.find("LET")["LET"].bind(this)(key[i], value[i]);
            }
          }.bind(this, params, [...arguments])
        );
      } catch (value) {
        switch (value.status) {
          case "success":
            return value.result;
          case "error":
          default:
            throw value;
        }
      }
    };

    this.Stack.push(obj);
  },
  DUMP: function(key) {
    var variable = this.find(key);
    if (variable) {
      console.log(JSON.stringify(variable, 2, 2));
    }
  },
  RETURN: function(value) {
    throw { status: "success", result: value };
  },
  SET: function(key, value) {
    var variable = this.find(key);

    // if no variable was found in the stack
    if (variable == null) {
      // If we're trying to set a standard variable, lets auto-define one
      if ((arguments.length = 2)) {
        this.Stack.push({ [key]: value });
        variable = this.find(key);
      } else {
        // otherwise, if we're trying to set an array, throw an error
        throw {
          status: "error",
          result: `Cannot set ${key} at index. Array is undefined.`
        };
      }
    } else {
      if (Array.isArray(variable[key])) {
        var args = Array.prototype.slice.call(arguments);
        var index = args.slice(1, args.length - 1).reverse();
        var value = args[args.length - 1];

        setIndex(variable[key], index);
        console.log("var", variable[key]);

        function setIndex(variable, index) {
          if (index.length > 1) {
            setIndex(variable[index[0]], index.slice(1));
          } else {
            variable[index[0]] = value;
          }
        }
      } else {
        variable[key] = value;
      }
    }
  },
  SET2: function(key) {
    var variable = this.find(key);

    if (variable && Array.isArray(variable[key])) {
      // If variable is an array, set the value at the specified index
      variable[key][arguments[1]] = arguments[2];
    } else {
      // if no variable was found in the stack, define one
      console.log("no variable found, definig one");
      if (variable == null) {
        this.Stack.push({ [key]: arguments[1] });
        variable = this.find(key);
      }
      // Set the variable value
      variable[key] = value;
    }
  },
  INC: function(key) {
    var variable = this.find(key);
    variable[key]++;
  },
  ADD: function(A, B) {
    return A + B;
  },
  SUB: function(A, B) {
    return A - B;
  },
  MUL: function(A, B) {
    return A * B;
  },
  DIV: function(A, B) {
    return A / B;
  },
  MOD: function(A, B) {
    return A % B;
  },
  "==": function(A, B) {
    return A == B;
  },
  "<>": function(A, B) {
    return A != B;
  },
  ">": function(A, B) {
    return A > B;
  },
  "<": function(A, B) {
    return A < B;
  },
  ">=": function(A, B) {
    return A >= B;
  },
  "<=": function(A, B) {
    return A <= B;
  },
  AND: function(A, B) {
    return A && B;
  },
  OR: function(A, B) {
    return A || B;
  },
  PRINT: function() {
    var string = "";
    for (var i = 0; i < arguments.length; i++) {
      string += arguments[i] != null ? arguments[i] : "";
    }
    console.log(string);
  },
  FOR: function*(key, start, end, step, script) {
    let startTime = Date.now();
    let variable = { [key]: start };
    this.Stack.push(variable);
    for (null; variable[key] <= end; variable[key] += step ? step : 1) {
      yield* this.evaluate(script);

      // ensure we never get caught in an infinite loop
      yield* this.update(this.shouldUpdate);
    }
  },
  IF: function*(condition, script) {
    if (condition) {
      yield* this.evaluate(script[0]);
    } else {
      if (script[1]) yield* this.evaluate(script[1]);
    }
  },
  WHILE: function*(condition, script) {
    let startTime = Date.now();
    while (yield* this.evaluate(script[0][0])) {
      yield* this.evaluate(script[1]);

      // ensure we never get caught in an infinite loop
      yield* this.update(this.shouldUpdate);
    }
  },
  SUSPENDUPDATE: function() {
    this.shouldUpdate = false;
  },
  RESUMEUPDATE: function*() {
    this.shouldUpdate = true;
    yield* this.update(true);
  },
  UPDATE: function*() {
    yield* this.update(true);
  }
};
