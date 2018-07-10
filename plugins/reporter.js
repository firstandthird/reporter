const fs = require('fs');
const path = require('path');

const register = async (server, options) => {
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
  const customSetter = path.join(server.settings.app.argsDir, 'args.js');
  if (fs.existsSync(customSetter)) {
    const argsArray = await require(customSetter)();
    server.methods.setArgs.apply(server, argsArray);
  }
  if (options.recurringReports) {
    options.recurringReports.forEach(recurringReport => {
      // run the report, save to s3 if saveTos3 is true:
      server.scheduleMethod(
        recurringReport.interval,
        `executeAndSaveReport('${recurringReport.name}.${recurringReport.format}',
         ${!recurringReport.saveToS3}, "${recurringReport.emails}")`
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
