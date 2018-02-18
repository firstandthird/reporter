module.exports = {
  async method(filename) {
    // default extension to csv:
    if (filename.split('.').length === 1) {
      filename = `${filename}.csv`;
    }
    const response = await this.inject({ method: 'get', url: filename });
    // don't proceed if there was an error:
    if (response.statusCode !== 200) {
      throw new Error(`there was an error while executing report ${filename}`);
    }
    return this.uploadToS3(filename, response.result);
  }
};
