const s3put = require('s3put');
const Readable = require('stream').Readable;
const datefmt = require('datefmt');

const register = (server, options) => {
  const settings = server.settings.app.s3;
  // returns a Promise, so call with 'await uploadToS3(....)'
  server.decorate('server', 'uploadToS3', (filename, text, noprefix, folder) => {
    // turn the incoming text into a Readable stream so it can be uploaded:
    const stream = new Readable();
    stream.push(text);
    stream.push(null);
    stream._read = function noop() {};
    filename = filename.replace(/\{\s*date\s*\}/gi, datefmt('%Y-%m-%d', new Date()));
    return s3put(stream, Object.assign({ filename, noprefix }, settings));
  });
};

exports.plugin = {
  name: 'aws',
  register,
  once: true,
  pkg: require('../package.json')
};
