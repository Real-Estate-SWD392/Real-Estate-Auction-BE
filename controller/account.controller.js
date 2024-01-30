const HTTP = require("../HTTP/HttpStatusCode");
const accountModel = require("../models/account.model");
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
const { memberModel } = require("../models/member.model");
const {
  generateTokens,
  generateResetToken,
} = require("../utils/generateAccountToken");
const accountTokenModel = require("../models/accountToken.model");

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

    let account = new accountModel({
      email,
      password,
    });

    const checkAccount = await account.save();

    // CREATE VERIFY TOKEN
    let verifyToken = new accountTokenModel({
      accountID: checkAccount._id,
      verifyToken: crypto.randomBytes(64).toString("hex"),
      verifyTokenExpires: Date.now() + 1800000,
    });

    await verifyToken.save();

    await sendVerifyEmail(account, verifyToken);

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
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
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

    const user = await accountModel.findOne({ email });

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

    // if (!user.isVerified)
    //   return res.status(HTTP.UNAUTHORIZED).json({
    //     success: false,
    //     error: EXCEPTIONS.WRONG_EMAIL_PASSWORD,
    //   });

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
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
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
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const account = await accountModel.findOne({ email });
    if (!account)
      return res.status(HTTP.NOT_FOUND).json({ message: "User not found!!" });

    const resetToken = await generateResetToken(account);

    const checkTokenExist = await accountTokenModel.findOne({
      accountID: account._id,
    });

    if (checkTokenExist) {
      const check = await accountTokenModel.findOneAndUpdate(
        { _id: checkTokenExist._id },
        { resetToken: resetToken, resetTokenExpires: Date.now() + 1800000 }
      );

      await sendForgotPasswordMail(account, accountToken);
      res.status(HTTP.OK).json({
        message: "Send Reset Password Mail Complete!!",
      });
    } else {
      const accountToken = await new accountTokenModel({
        accountID: account._id,
        resetToken,
        resetTokenExpires: Date.now() + 1800000,
      }).save();

      await sendForgotPasswordMail(account, accountToken);
      res.status(HTTP.OK).json({
        message: "Send Reset Password Mail Complete!!",
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const resetToken = await accountTokenModel.findOne({
      accountID: decoded._id,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!resetToken)
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid or expired password reset token",
      });

    const newPassword = req.body.password;

    const account = await accountModel.findOne({ _id: decoded._id });

    account.password = newPassword;

    await account.save();

    const expiresToken = await accountTokenModel.findOneAndUpdate(
      { accountID: decoded._id },
      { $unset: { resetToken: 1, resetTokenExpires: 1 } },
      { new: true }
    );

    if (!expiresToken.resetToken && !expiresToken.resetTokenExpires) {
      res.status(HTTP.OK).json({
        message: "Reset Password Successfully!!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        message: "Reset Password Fail!!",
      });
    }
  } catch (error) {
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

    const user = await accountModel.findOne({ _id });

    const checkTokenValid = await accountTokenModel.findOne({
      accountID: user._id,
      verifyToken,
      verifyTokenExpires: { $gt: Date.now() },
    });

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

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await accountModel.find({});

    if (accounts.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: accounts,
      });
    } else {
      res.status(HTTP.NOT_FOUND).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_GET_ITEM,
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const changeAccountPassword = async (req, res) => {
  try {
    const { _id, oldPassword, newPassword } = req.body;

    if (newPassword === oldPassword)
      return res.status(HTTP.BAD_REQUEST).json({
        succes: false,
        error: "New Password should be different from Old Password",
      });

    const account = await accountModel.findOne({ _id });

    const checkValidPassword = await bcrypt.compare(
      oldPassword,
      account.password
    );

    if (checkValidPassword) {
      account.password = newPassword;
      await account.save();

      return res.status(HTTP.OK).json({
        succes: true,
        response: account,
        message: "Update Password Successfully",
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        succes: false,
        error: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
        message: "Old Password not correct!",
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const _id = req.params.id;

    console.log(_id);

    const checkDeleteAccount = await accountModel.deleteOne({ _id });
    const checkDeleteMember = await memberModel.deleteOne({
      accountID: _id,
    });
    const checkDeleteToken = await accountTokenModel.deleteOne({
      accountID: _id,
    });

    if (
      checkDeleteAccount.deletedCount > 0 &&
      checkDeleteMember.deletedCount > 0 &&
      checkDeleteToken.deletedCount > 0
    ) {
      res.status(HTTP.OK).json({
        success: true,
        response: checkDeleteAccount,
        message: "Remove Account Succesfully!!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_DELETE_ITEM,
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  registerAccount,
  loginAccount,
  logoutAccount,
  verifyEmail,
  getAllAccounts,
  changeAccountPassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
