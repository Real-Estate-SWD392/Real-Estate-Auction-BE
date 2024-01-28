const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465, // Port for Gmail
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendVerifyEmail = async (user, token) => {
  try {
    const mailOption = {
      from: `Email from <${process.env.USER}>`,
      to: user.email,
      subject: "Test Send Mail",
      html: `<p>Please verify your account by clicking this link:</p> 
      <a href="${process.env.BASE_URL}/verify-email?verifyToken=${token.verifyToken}&userID=${user._id}">VERIFY YOUR ACCOUNT</a>`,
    };

    // CREATE EMAIL TRANSPORTER

    await transporter.sendMail(mailOption, (err, infor) => {
      if (err) {
        console.log(err);
      } else {
        console.log("SEND SUCCESFULLY");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const sendForgotPasswordMail = async (user, token) => {
  try {
    const resetURL = `${process.env.BASE_URL}/resetPassword?token=${token.resetToken}`;

    const mailOption = {
      from: `Email from <${process.env.USER}>`,
      to: user.email,
      subject: "Test Send Mail",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetURL}">HERE</a>`,
    };

    // CREATE EMAIL TRANSPORTER

    await transporter.sendMail(mailOption, (err, infor) => {
      if (err) {
        console.log(err);
      } else {
        console.log("SEND SUCCESFULLY");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendVerifyEmail, sendForgotPasswordMail };
