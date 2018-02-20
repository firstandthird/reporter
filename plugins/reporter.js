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
      server.methods.addReport(path.basename(file, '.js'), require(path.join(reportDir, file)));
    });
  }
  if (options.recurringReports) {
    options.recurringReports.forEach(recurringReport => {
      // run the report and save to s3:
      server.scheduleMethod(
        recurringReport.interval,
        `executeAndSaveReport('${recurringReport.name}.${recurringReport.format}',
         ${!recurringReport.saveToS3})`
      );
    });
  }
};

exports.plugin = {
  name: 'reporter',
  register,
  once: true,
  pkg: require('../package.json')
};
