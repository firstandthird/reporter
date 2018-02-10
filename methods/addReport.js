module.exports = {
  method(name, fn) {
    if (typeof fn === 'function') {
      fn = {
        method: fn
      };
    }
    if (fn.options && typeof fn.options.cache === 'function') {
      fn.options = fn.options || {};
      fn.options.cache = fn.options.cache(this, this.settings.app);
    }

    this.reports.methods[name] = fn;
  }
};
