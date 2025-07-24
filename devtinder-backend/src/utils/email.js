const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bharaths14051803@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"DevTinder" <bharaths14051803@gmail.com>',
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };
