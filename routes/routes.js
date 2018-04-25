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
    const links = [];
    Object.keys(server.methods.reports).forEach(key => {
      const root = `${server.info.uri}/${key}`;
      links.push({
        csv: `${root}.csv`,
        html: `${root}.html`,
        json: `${root}.json`
      });
    });
    return h.response(links);
  }
};
