const nodemailer = require("nodemailer");

const emailHelper = async (option) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    service: process.env.SERVICE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const message = {
    from: "Time Manager",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(message);
};

module.exports = emailHelper;