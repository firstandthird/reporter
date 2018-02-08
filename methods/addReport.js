module.exports = {
  method(name, fn) {
    this.reports.methods[name] = fn;
  }
};
