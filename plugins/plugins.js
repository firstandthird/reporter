const register = (server, options) => {
  server.decorate('server', 'reports', {
    args: [],
    methods: {}
  });
};

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
};
