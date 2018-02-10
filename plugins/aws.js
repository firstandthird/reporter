const s3put = require('s3put');

const register = (server, options) => {
  const settings = server.settings.app.s3;
  console.log('aws settings')
  console.log('aws settings')
  console.log('aws settings')
  // returns a Promise, so call with 'await uploadToS3(....)'
  server.decorate('server', 'uploadToS3', (name, data) => s3put(data, Object.assign({ name }, settings)));
};

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
};
