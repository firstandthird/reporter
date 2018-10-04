module.exports = {
  async method(filename, args, noS3, emails) {
    // default extension to csv:
    if (filename.split('.').length === 1) {
      filename = `${filename}.csv`;
    }
    if (!filename.startsWith('/')) {
      filename = `/${filename}`;
    }
    if (args) {
      filename = `${filename}?${args}`;
    }
    // inject with credentials to bypass hapi-password:
    this.log(['recurring'], `executing report ${filename} with ${args}`);
    try {
      const response = await this.inject({ method: 'get', url: filename, credentials: { id: 'server' } });
      // don't proceed if there was an error:
      if (response.statusCode !== 200) {
        throw new Error(`there was an error while executing report ${filename}`);
      }
      this.log(['recurring', 'report'], `report ${filename} executed correctly`);
      // option to skip uploading:
      if (noS3) {
        return response.result;
      }
      const result = await this.uploadToS3(filename, response.result);
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
