const nodemailer = require('nodemailer');

const register = (server, options) => {
  const transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    auth: {
      user: options.user,
      pass: options.password
    }
  });
  server.decorate('server', 'email', (filename, report, s3Result, emails) => new Promise(resolve => {
    if (!emails) {
      return;
    }
    if (options.host === '') {
      throw new Error(`SMTP_HOST not set for report ${filename} emails: ${emails.join(',')}`);
    }

    const mailOptions = {
      from: options.from,
      to: emails.join(','),
      subject: filename,
      html: `A new report was generated at ${new Date()} and is available for review <a href="${s3Result.Location}">here. </a>`
    };
    transporter.sendMail(mailOptions, (err, mailResult) => {
      if (err) {
        server.log(['email', 'error'], err);
      }
      return resolve({ mailResult, mailOptions });
    });
  }));
};

exports.plugin = {
  name: 'email',
  register,
  once: true,
  pkg: require('../package.json')
};
