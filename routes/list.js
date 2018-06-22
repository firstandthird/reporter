// returns a table listing all registered reports:
exports.routes = {
  method: 'GET',
  path: '/',
  config: {
    plugins: {
      'hapi-transform-table': {}
    }
  },
  handler(request, h) {
    const server = request.server;
    let base = server.settings.app.routePrefix ?
      `${request.info.host}/${server.settings.app.routePrefix}`
      : `${request.info.host}`;
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
