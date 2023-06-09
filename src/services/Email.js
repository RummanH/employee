const path = require('path');

const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Mohammad Rumman <${process.env.EMAIL_FROM}>`;
  }

  // Create transporter based on environment.
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'sendGrid',
        auth: {
          user: process.env.SEND_GRID_USERNAME,
          pass: process.env.SEND_GRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  // send method responsible for sending actual emails.
  async send(template, subject) {
    // 1) Render HTML based on a pug template.
    const html = pug.renderFile(
      path.join(__dirname, '.', 'email-templates', `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText(html),
      html,
    };

    // 3) Actually send emails using transporter
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to our Family!');
  }

  async sendRecToSf() {
    await this.send('recToSf', 'Thank you!');
  }

  async sendRecToEm() {
    await this.send('recToEm', 'Thank you!');
  }

  async sendFeToSf() {
    await this.send('feToSf', 'Thank you!');
  }

  async sendFeToEm() {
    await this.send('feToEm', 'Thank you!');
  }

  async sendReset() {
    await this.send('reseted', 'Password reset!');
  }

  async sendVerify() {
    await this.send('verify', 'your verification code');
  }

  async sendPasswordReset() {
    await this.send(
      'passReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }
}

module.exports = Email;
