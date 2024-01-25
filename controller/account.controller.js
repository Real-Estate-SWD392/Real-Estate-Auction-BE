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

// CREATE NEW TOKEN FOR USER
const generateUserToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });
};

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

      const token = generateUserToken(account);

      res.status(200).json({
        success: true,
        response: member,
        token: token,
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
    let user = await accountModel.findOne({ email });

    if (!user)
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.WRONG_EMAIL_PASSWORD,
      });

    const checkValidPassword = await bcrypt.compare(password, user.password);

    if (!checkValidPassword)
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.WRONG_EMAIL_PASSWORD,
      });

    const member = await memberModel.findOne({ email });

    const token = generateUserToken(user);

    res.status(HTTP.OK).json({
      success: true,
      response: member,
      token: token,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
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

module.exports = { registerAccount, loginAccount, verifyEmail };
