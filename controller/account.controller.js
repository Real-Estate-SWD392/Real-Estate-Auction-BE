const HTTP = require("../HTTP/HttpStatusCode");
const accountModel = require("../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const EXCEPTIONS = require("../exceptions/Exceptions");
const { validationResult } = require("express-validator");
const { sendVerifyEmail } = require("../services/email");
const path = require("path");
const { memberModel } = require("../models/member.model");
const generateTokens = require("../utils/generateAccountToken");

// REGISTER
const registerAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    let checkExistUser = await accountModel.findOne({ email });

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let account = new accountModel({
      email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });

    const checkAccount = await account.save();

    const checkVerify = await sendVerifyEmail(account);

    if (checkAccount) {
      let member = new memberModel({
        accountID: checkAccount._id,
        email,
        firstName,
        lastName,
        phoneNumber,
      });
      await member.save();

      res.status(200).json({
        success: true,
        response: member,
      });
    } else {
      res.status(HTTP.INTERNAL_SERVER_ERROR).json("Cannot create account");
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

// LOGIN
const loginAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await accountModel.findOne({ email });

    if (!user)
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.WRONG_EMAIL_PASSWORD,
      });

    const checkValidPassword = await bcrypt.compare(password, user.password);

    if (!checkValidPassword)
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        error: EXCEPTIONS.WRONG_EMAIL_PASSWORD,
      });

    const member = await memberModel.findOne({ email });

    const { accessToken, refreshToken } = await generateTokens(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .header("authorization", accessToken)
      .status(HTTP.OK)
      .json({
        succes: true,
        response: member,
        accessToken,
        refreshToken,
        message: "Logged in sucessfully",
      });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json("INTERNAL_SERVER_ERROR");
  }
};

const logoutAccount = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = req.headers["authorization"];

    if (!refreshToken && !accessToken) {
      return res
        .status(HTTP.OK)
        .json({ success: true, message: "Logged Out Sucessfully" });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Logged Out Failed",
      });
    }
  } catch (err) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.query.emailToken;

    if (!emailToken)
      return res.status(HTTP.NOT_FOUND).json("Email Token not found!!");

    const user = await accountModel.findOne({ emailToken });

    if (user) {
      user.emailToken = null;
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

module.exports = { registerAccount, loginAccount, logoutAccount, verifyEmail };
