const nodemailer = require("nodemailer");

const sendVerifyEmail = async (user) => {
  try {
    const mailOption = {
      from: `Email from <${process.env.USER}>`,
      to: user.email,
      subject: "Test Send Mail",
      html: `<p>Please verify your account by clicking this link:</p> 
      <a href="${process.env.BASE_URL}/verify-email?emailToken=${user.emailToken}">VERIFY YOUR ACCOUNT</a>`,
    };

    // CREATE EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465, // Port for Gmail
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

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

module.exports = { sendVerifyEmail };
