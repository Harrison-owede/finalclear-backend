const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password'
    }
  });

  await transporter.sendMail({
    from: '"Vortech Admin" <your_email@gmail.com>',
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
