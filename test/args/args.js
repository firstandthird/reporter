// an example argument setter, you can export your own argument-setter
// by putting your array-returning function in your own args.js in your project's CWD
module.exports = function() {
  return [{ find: (query) => 'my database' }, { exampleValue: 5 }];
};
