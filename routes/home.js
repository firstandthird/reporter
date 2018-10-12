const Boom = require('boom');

const qs = require('querystring');

exports.home = {
  method: 'GET',
  path: '/{name}',
  config: {
    auth: 'password',
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
    return fn(request, ...server.reports.args);
  }
};

exports.execute = {
  method: 'GET',
  path: '/execute/{name}',
  config: {
    auth: 'password'
  },
  handler(request, h) {
    const execute = request.server.methods.executeAndSaveReport;
    const format = request.query.format || 'csv';
    const filename = request.query.filename || `${request.params.name}.${format}`;
    const noS3 = request.query.noS3 || false;
    const noPrefix = request.query.noPrefix || false;
    const emails = request.query.emails || '';

    delete request.query.format;
    delete request.query.filename;
    delete request.query.noS3;
    delete request.query.noPRefix;
    delete request.query.emails;

    execute(request.params.name, filename, qs.stringify(request.query), noS3, noPrefix, emails);
    return 'ok';
  }
};
