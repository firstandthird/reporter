// the default argument setter, you can export your own argument-setter
// by putting your array-returning function in your own args.js in your project's CWD
// 'this' will always be bound to the server for you:
module.exports = function() {
  return [this];
};
