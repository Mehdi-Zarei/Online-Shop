const nodemailer = require("nodemailer");
const configs = require("../../configs");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: configs.nodemailer.user,
    pass: configs.nodemailer.pass,
  },
});

module.exports = {
  sendVerificationEmail: async (user, subject, text) => {
    const mailToSend = {
      from: configs.nodemailer.user,
      to: user.email,
      subject,
      html: text,
    };

    try {
      await transporter.sendMail(mailToSend);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
