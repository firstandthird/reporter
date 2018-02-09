const fs = require('fs');
const path = require('path');

module.exports = {
  method() {
    const reportDir = this.rapptor.server.settings.app.reportsDir;
    if (fs.existsSync(reportDir)) {
      fs.readdirSync(reportDir).forEach(file => {
        const data = fs.readFileSync(path.join(reportDir, file), 'utf-8');
        this.addReport(file, () => data);
      });
    }
  }
};
