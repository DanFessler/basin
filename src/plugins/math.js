module.exports = {
  ADD: function (A, B) {
    return A + B;
  },
  SUB: function (A, B) {
    return A - B;
  },
  MUL: function (A, B) {
    return A * B;
  },
  DIV: function (A, B) {
    return A / B;
  },
  MOD: function (A, B) {
    return A % B;
  },
  ABS: (x) => {
    return Math.abs(x);
  },
  SIN: (x) => {
    return Math.sin(x);
  },
  COS: (x) => {
    return Math.cos(x);
  },
  TAN: (x) => {
    return Math.tan(x);
  },
  ARCSIN: (x) => {
    return Math.asin(x);
  },
  ARCCOS: (x) => {
    return Math.acos(x);
  },
  ARCTAN: (x) => {
    return Math.atan(x);
  },
  FLOOR: (x) => {
    return Math.floor(x);
  },
  CEIL: (x) => {
    return Math.ceil(x);
  },
  ROUND: (x) => {
    return Math.round(x);
  },
  MOD: (n, m) => {
    return ((n % m) + m) % m;
  },
  RANDOM: () => {
    return Math.random();
  },
  RANDOMINT: (min, max) => {
    // max inclusive
    return Math.floor(Math.random() * (max + 1 - min) + min);
  },
  SQRT: (x) => {
    return Math.sqrt(x);
  },
};
