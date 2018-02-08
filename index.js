const Rapptor = require('rapptor');

class Reporter {
  constructor() {
    this.rapptor = new Rapptor({});
    this.args = [];
    this.methods = {};
    this.started = false;
  }

  async start() {
    await this.rapptor.start();
    this.started = true;
    this.setArgs(this.args);
    this.rapptor.server.reports.methods = this.methods;
  }

  async stop() {
    await this.rapptor.stop();
    this.started = false;
  }

  setArgs(args) {
    if (!this.started) {
      this.args = args;
      return;
    }
    this.rapptor.server.methods.setArgs(args);
  }

  addReport(name, fn) {
    if (!this.started) {
      this.methods[name] = fn;
      return;
    }
    this.rapptor.server.methods.addReport(name, fn);
  }
}

module.exports = Reporter;
