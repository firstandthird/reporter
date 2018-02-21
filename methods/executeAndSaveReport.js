module.exports = {
  async method(filename, noS3) {
    // default extension to csv:
    if (filename.split('.').length === 1) {
      filename = `${filename}.csv`;
    }
    if (!filename.startsWith('/')) {
      filename = `/${filename}`;
    }
    const response = await this.inject({ method: 'get', url: filename });
    // don't proceed if there was an error:
    if (response.statusCode !== 200) {
      throw new Error(`there was an error while executing report ${filename}`);
    }
    // option to skip uploading:
    if (noS3) {
      return response.result;
    }
    return this.uploadToS3(filename, response.result);
  }
};
