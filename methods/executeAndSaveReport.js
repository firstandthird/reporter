const datefmt = require('datefmt');

module.exports = {
  async method(reportName, filename, args, noS3, noPrefix, emails) {
    // default extension to csv:
    if (reportName.split('.').length === 1) {
      reportName = `${reportName}.csv`;
    }

    if (!reportName.startsWith('/')) {
      reportName = `/${reportName}`;
    }

    if (!filename || filename === 'undefined' || filename === undefined) {
      filename = reportName;
    }

    if (!filename.startsWith('/')) {
      filename = `/${filename}`;
    }

    if (args) {
      reportName = `${reportName}?${args}`;
    }
    // inject with credentials to bypass hapi-password:
    this.log(['recurring'], `executing report ${reportName} with ${args}`);
    try {
      const response = await this.inject({ method: 'get', url: reportName, credentials: { id: 'server' } });
      // don't proceed if there was an error:
      if (response.statusCode !== 200) {
        throw new Error(`there was an error while executing report ${reportName}`);
      }
      this.log(['recurring', 'report'], `report ${reportName} executed correctly`);
      // option to skip uploading:
      if (noS3) {
        return response.result;
      }


      filename = filename.replace(/\{\s*date\s*\}/gi, datefmt('%Y-%m-%d', new Date()));
      const ts = Math.ceil((new Date()).getTime() / 1000);
      filename = filename.replace(/\{\s*time\s*\}/gi, ts);

      this.log(['recurring', 'report'], `Uploading report ${reportName} as ${filename}`);

      const result = await this.uploadToS3(filename, response.result, noPrefix);
      this.log(['recurring', 's3'], `report ${filename} uploaded to S3`);
      if (emails) {
        result.emailResult = await this.email(filename, response.result, result, [emails]);
      }
      this.log(['recurring', 'email'], `report ${filename} emailed to ${emails}`);
      return result;
    } catch (e) {
      this.log(['recurring', 'error'], e);
    }
  }
};
