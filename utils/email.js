const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Fatema khalaf <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  // Send the acual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      // these data here will be sent to the template
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) Define email options
    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a trtansport and send email
    await this.newTransport().sendMail(mailOption);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcom to the Natours family!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutis)'
    );
  }
};

//////////////////////////////////////////
// REFERANCE CODE
//////////////////////////////////////////

// const sendEmail = async (options) => {
// 1) Create a transporter

// For gmail 👇
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     password: process.env.EMAIL_PASSWORD,
//   },
//   // then activate in gmail "less secure app" option
// });

// for othe mail servers 👇
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// 2) Define the email options
// const mailOption = {
//   from: 'Fatema khalaf <admin@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   //html:
// };

// 3) Actually send the email
//   await transporter.sendMail(mailOption);
// };

// module.exports = sendEmail;
