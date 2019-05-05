// Script is an array of expressions to be evaluated
// parameters are also an array of expressions
// if only one expression, no need for the array
// if expression is a literal, no need for the object

let core = require("./core.js");

class Basin {
  constructor() {
    this.Stack = [];
    this.shouldUpdate = true;
    this.import(core, this);
  }

  import(plugin, newThis) {
    Object.keys(plugin).forEach(key => {
      this.Stack.push({
        [key]: newThis ? plugin[key].bind(newThis) : plugin[key]
      });
    });
  }

  start(script, delay) {
    console.log("START");
    this.startTime = Date.now();
    this.Gen = this.runScript(script);
    this.run(delay);
  }

  run(delay) {
    if (!this.Gen) return;

    let result = this.Gen.next();

    if (!result.done) {
      if (delay) {
        setTimeout(this.run.bind(this, script, delay), delay);
      } else {
        if (!typeof window) {
          window.requestAnimationFrame(this.run.bind(this, script));
        } else {
          setImmediate(this.run.bind(this));
        }
      }
    } else {
      console.log("done");
    }
  }

  stop() {
    console.log("STOP");
    this.Gen = null;
  }

  *update(update) {
    if (update || Date.now() - this.startTime > 1000) {
      this.startTime = Date.now();
      yield;
    }
  }

  *runCommand(command) {
    // Attempt to run the function
    let result = command();

    // if we got back a generator, run it
    if (result && result.next) {
      result = yield* command();
    }

    return result;
  }

  *runScript(script, init) {
    // Mark where the new memory stack begins
    var stackindex = this.Stack.length;

    // run any initialization inside the new stack
    // this includes local function variables, etc
    if (init) init();

    // iterate over the script
    for (var i = 0; i < script.length; i++) {
      script[i] = yield* this.evaluate(script[i]);
    }

    // pop the memory stack back to where it was
    this.Stack.splice(stackindex);

    // return an array of evaluated expressions
    return script;
  }

  find(keyword, showError) {
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
  }

  *evaluate(expression, init) {
    // if expression is literal, return itself as the value
    if (!expression || typeof expression != "object") return expression;

    // if expression is a script, run it
    if (Array.isArray(expression)) {
      return yield* this.runScript(expression.slice(), init);
    }

    // Otherwise...

    // Get keyword and parameters. Evaluate params and ensure it is an array
    var keyword = Object.keys(expression)[0];
    var params = yield* this.evaluate(expression[keyword]);
    params = Array.isArray(params) ? params : [params];

    // if a script exists for this expression, add it to params (without evaluating)
    if ("script" in expression) {
      params.push(expression.script);
    }

    // Execute keyword from the stack with the computed params
    var match = this.find(keyword, true);
    if (match) {
      return typeof match[keyword] == "function"
        ? yield* this.runCommand(match[keyword].bind(this, ...params))
        : match[keyword];
    }

    return;
  }
}

module.exports = new Basin();
