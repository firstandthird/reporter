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
    if (fn.options) {
      fn.options.bind = this;
    } else {
      fn.options = { bind: this };
    }
    // reports are stored as server.methods.reports[name] where hapi can cache them:
    this.method(`reports.${name}`, fn.method, fn.options);
  }
};
