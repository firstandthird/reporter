const register = (server, options) => {
  server.decorate('server', 'args', []);
  server.decorate('server', 'reports', {});
};

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
};
