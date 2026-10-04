const nodemailer = require("nodemailer");
module.exports.sendMail = (html, email) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS_NODEMAIL,
    },
  });

  const mail = {
    form: process.env.EMAIL,
    to: email,
    subject: "[Home Up] Mã OTP:",
    html: html,
  };
  try {
    transport.sendMail(mail);
  } catch (error) {
    throw error;
  }
};
