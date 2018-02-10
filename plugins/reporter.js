const fs = require('fs');
const path = require('path');

const register = (server, options) => {
  server.decorate('server', 'reports', {
    args: [],
    methods: {}
  });
  const reportDir = server.settings.app.reportsDir;
  if (fs.existsSync(reportDir)) {
    fs.readdirSync(reportDir).forEach(file => {
      const report = require(path.join(reportDir, file));
      if (typeof report.cache === 'function') {
        report.options = report.options || {};
        report.options.cache = report.options.cache(server, options);
      }
      server.methods.addReport(path.basename(file, '.js'), report);
    });
  }
};

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
};
