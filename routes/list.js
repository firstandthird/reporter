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
    const base = server.settings.app.routePrefix ?
      `${server.settings.app.routePrefix}`
      : '';
    const links = [];
    Object.keys(server.methods.reports).forEach(key => {
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
    return h.redirect('/reports');
  }
};
