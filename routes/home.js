const Boom = require('boom');

exports.home = {
  method: 'GET',
  path: '/{name}',
  config: {
    plugins: {
      'hapi-transform-csv': {},
      'hapi-transform-table': {}
    }
  },
  handler(request, h) {
    const server = request.server;
    const { name } = request.params;
    const fn = server.methods.reports[name];
    if (!fn) {
      throw Boom.notFound();
    }
    return fn(...server.reports.args);
  }
};
