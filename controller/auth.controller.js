const HTTP = require("../HTTP/HttpStatusCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const EXCEPTIONS = require("../exceptions/Exceptions");
const { validationResult } = require("express-validator");
const {
  sendVerifyEmail,
  sendForgotPasswordMail,
} = require("../services/email");
const path = require("path");
const {
  generateTokens,
  generateResetToken,
} = require("../utils/generateAccountToken");
const userModel = require("../models/user.model");
const { lte } = require("lodash");

const registerAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, re_password } =
      req.body;

    if (password !== re_password) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "Password and Confirm password not the same!!" });
    }

    let checkExistUser = await userModel.findOne({ email });

    if (checkExistUser)
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ succes: false, error: EXCEPTIONS.USER_HAS_EXIST });

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });

    let user = new userModel({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      verifyToken: crypto.randomBytes(64).toString("hex"),
      verifyTokenExpires: Date.now() + 1800000,
    });

    const checkUser = await user.save();

    await sendVerifyEmail(user);

    if (checkUser) {
      res.status(200).json({
        success: true,
        response: user,
        message: "Register successfully!",
      });
    } else {
      res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: "Register Fail" });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: "Register Fail",
    });
  }
};

const loginAccount = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        error: EXCEPTIONS.WRONG_EMAIL_PASSWORD,
      });

    const checkValidPassword = await bcrypt.compare(password, user.password);

    if (!checkValidPassword)
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        error: EXCEPTIONS.WRONG_EMAIL_PASSWORD,
      });

    if (!user.isVerified)
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        error: "Your account is not verifed",
      });

    const member = await userModel.findOne({ email });

    const { accessToken, refreshToken } = await generateTokens(user);

    res
      .cookie("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
      })
      .header("authorization", `Bearer ${accessToken}`)
      .status(HTTP.OK)
      .json({
        succes: true,
        response: user,
        accessToken,
        refreshToken,
        message: "Logged in sucessfully",
      });
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const logoutAccount = async (req, res) => {
  try {
    req.logout(function (err) {
      if (err) {
        return res.status(HTTP.BAD_REQUEST).json({
          success: false,
          message: "Logged Out Failed",
        });
      } else {
        return res
          .status(HTTP.OK)
          .json({ success: true, message: "Logged Out Sucessfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(HTTP.NOT_FOUND).json({ message: "User not found!!" });

    const resetToken = await generateResetToken(user);

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 1800000;

    await user.save();

    await sendForgotPasswordMail(user);
    res.status(HTTP.OK).json({
      message: "Send Reset Password Mail Complete!!",
    });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const resetToken = await userModel.findOne({
      _id: decoded._id,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!resetToken)
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid or expired password reset token",
      });

    const newPassword = req.body.password;

    const user = await userModel.findOne({ _id: decoded._id });

    user.password = newPassword;

    user.resetToken = undefined;

    user.resetTokenExpires = undefined;

    await user.save();

    if (!user.resetToken && !user.resetTokenExpires) {
      res.status(HTTP.OK).json({
        message: "Reset Password Successfully!!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        message: "Reset Password Fail!!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      succes: false,
      message: "Reset Password Fail",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const _id = req.query.userID;
    const verifyToken = req.query.verifyToken;

    if (!verifyToken)
      return res.status(HTTP.NOT_FOUND).json("Email Token not found!!");

    const user = await userModel.findOne({ _id });

    let checkTokenValid = false;

    if (user.verifyToken && user.verifyTokenExpires - Date.now() > 0) {
      checkTokenValid = true;
    }

    if (user && checkTokenValid) {
      user.isVerified = true;
      await user.save();

      res.sendFile(path.join(__dirname, "./../views/verified.html"));
    } else {
      res.status(HTTP.NOT_FOUND).json("Verify email fail!!");
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  registerAccount,
  loginAccount,
  logoutAccount,
  verifyEmail,
  resetPassword,
  forgotPassword,
};
