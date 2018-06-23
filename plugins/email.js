const nodemailer = require('nodemailer');

const register = (server, options) => {
  if (options.host === '') {
    return;
  }
  const transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    auth: {
      user: options.user,
      pass: options.password
    }
  });
  server.decorate('server', 'email', (filename, report, s3Result, emails) => {
    console.log('emailer called');
    console.log('emailer called');
    console.log(filename);
    console.log(report);
    console.log(s3Result);
    console.log(emails);
    if (!emails) {
      return;
    }
    const mailOptions = {
      from: options.from,
      to: emails.join(','),
      subject: filename,
      html: `A new report was generated at ${new Date()} and is available for review <a href="${s3Result.Location}">here. </a>`
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (err, info) => {
      console.log('+');
      console.log(err);
      console.log(info);
    });
  });
};

exports.plugin = {
  name: 'email',
  register,
  once: true,
  pkg: require('../package.json')
};
