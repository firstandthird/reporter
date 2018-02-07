module.exports = {
  method(name, fn) {
    this.reports[name] = fn;
  }
};
