const os = require('os');

exports.routes = {
  method: 'GET',
  path: '/robots.txt',
  handler(request, h) {
    return h.response(`User-agent: *${os.EOL}Disallow: /`).type('text/plain');
  }
};
