// returns a table listing all registered reports:
exports.routes = {
  method: 'GET',
  path: '/reports',
  config: {
    plugins: {
      'hapi-transform-table': {}
    }
  },
  handler(request, h) {
    const server = request.server;
    const settings = server.settings.app;
    const base = settings.routePrefix ? `${server.settings.app.routePrefix}` : '';
    const links = [];
    Object.keys(server.methods.reports).forEach(key => {
      // skip any that are in the hiddenReports list:
      if (settings.hiddenReports && settings.hiddenReports.includes(key)) {
        return;
      }
      const root = `${base}/${key}`;
      links.push({
        name: key,
        csv: `${root}.csv`,
        html: `${root}.html`,
        json: `${root}.json`,
      });
    });
    return h.response(links);
  }
};

exports.redirect = {
  method: 'GET',
  path: '/',
  handler(request, h) {
    return h.redirect('/reports.html');
  }
};
