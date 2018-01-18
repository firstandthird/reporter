const Boom = require('boom');
const Hapi = require('hapi');

class Reporter {
  constructor(options = {}) {
    this.options = options;
    this.server = Hapi.server({
      port: process.env.PORT || 8080,
      debug: {
        request: ['error']
      }
    });
    this.reports = {};
    this.args = [];
  }

  setArgs(...args) {
    this.args = args;
  }

  addReport(name, fn) {
    this.reports[name] = fn;
  }

  setupRoute() {
    const self = this;
    this.server.route({
      method: 'GET',
      path: '/{name}',
      config: {
        plugins: {
          'hapi-transform-csv': {
          },
          'hapi-transform-table': {
          }
        }
      },
      handler(request, h) {
        const { name } = request.params;
        const fn = self.reports[name];
        if (!fn) {
          throw Boom.notFound();
        }
        return fn(...self.args);
      }
    });
  }

  async setupPlugins() {
    await this.server.register({
      plugin: require('hapi-logr'),
      options: {
        reporters: {
          flat: {
            reporter: require('logr-flat'),
            options: {
            }
          }
        }
      }
    });
    await this.server.register(require('hapi-transform-csv'));
    await this.server.register(require('hapi-transform-table'));
  }

  async start() {
    this.setupRoute();
    await this.setupPlugins();
    await this.server.start();
  }

  async stop() {
    await this.server.stop();
  }
}

module.exports = Reporter;
