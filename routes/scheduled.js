const moment = require('moment');

// returns a table listing all registered reports:
exports.routes = {
  method: 'GET',
  path: '/scheduled',
  config: {
    plugins: {
      'hapi-transform-table': {}
    }
  },
  handler(request, h) {
    const server = request.server;
    const links = [];
    Object.keys(server.plugins.reporter.scheduledReports).forEach(name => {
      links.push({
        name,
        next: moment(server.plugins.reporter.scheduledReports[name].nextDates[0])
          .format('dddd, MMMM Do YYYY, h:mm:ss a')
      });
    });
    return links;
  }
};
