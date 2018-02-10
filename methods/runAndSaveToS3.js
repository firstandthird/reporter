module.exports = {
  async method(name) {
    console.log('runandSave')
    console.log('runandSave')
    console.log('runandSave')
    console.log(name)
    const output = await this.inject({ method: 'get', url: name });
    console.log(output)
    // returns a Promise:
    return this.uploadToS3(name, output);
  }
};
