const nodemailer = require("nodemailer");
const moment = require("moment");

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465, // Port for Gmail
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendVerifyEmail = async (user) => {
  try {
    const mailOption = {
      from: `Email from <${process.env.USER}>`,
      to: user.email,
      subject: "Test Send Mail",
      html: `<p>Please verify your account by clicking this link:</p> 
      <a href="${process.env.BASE_URL}/auth/verify-email?verifyToken=${user.verifyToken}&userID=${user._id}">VERIFY YOUR ACCOUNT</a>`,
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

const sendNotificationMail = async (user, startDate) => {
  try {
    const mailOption = {
      from: `Email from <Pinterest Real Estate Auction>`,
      to: user.email,
      subject: "Your Auction Is Approve",
      html: `<p>Your Auction will start at: ${moment(startDate)
        .subtract(1, "days")
        .format("DD-MM-YYYY")}</p> `,
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

const sendForgotPasswordMail = async (user) => {
  try {
    const resetURL = `${process.env.BASE_URL}/auth/resetPassword?token=${user.resetToken}`;

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

module.exports = {
  sendVerifyEmail,
  sendForgotPasswordMail,
  sendNotificationMail,
};
