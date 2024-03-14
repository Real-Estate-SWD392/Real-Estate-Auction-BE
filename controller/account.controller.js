const HTTP = require("../HTTP/HttpStatusCode");
const accountModel = require("../models/account.model");
const bcrypt = require("bcrypt");
const EXCEPTIONS = require("../exceptions/Exceptions");
const { memberModel } = require("../models/member.model");
const userModel = require("../models/user.model");

const getAllAccount = async (req, res) => {
  try {
    const accounts = await userModel.find({
      role: { $in: ["member", "staff"] },
    });

    res.status(HTTP.OK).json({
      success: true,
      response: accounts,
    });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const getAccountByRole = async (req, res) => {
  try {
    const role = req.params.role;

    const accounts = await userModel.find({ role });

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
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const changeAccountPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const _id = req.params.id;

    const account = await userModel.findOne({ _id });

    const checkValidPassword = await bcrypt.compare(
      oldPassword,
      account.password
    );

    if (!checkValidPassword) {
      return res.status(HTTP.BAD_REQUEST).json({
        succes: false,
        error: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
        message: "Old Password not correct!",
      });
    }

    if (newPassword === oldPassword)
      return res.status(HTTP.BAD_REQUEST).json({
        succes: false,
        error: "New Password should be different from Old Password",
      });

    if (newPassword !== confirmPassword)
      return res.status(HTTP.BAD_REQUEST).json({
        succes: false,
        error: "Repeat Password should be the same whith new password",
      });

    account.password = newPassword;
    await account.save();

    return res.status(HTTP.OK).json({
      succes: true,
      response: account,
      message: "Update Password Successfully",
    });
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const _id = req.params.id;

    const checkDeleteAccount = await userModel.findOneAndUpdate(
      { _id },
      { status: "Inactive" },
      { new: true }
    );

    if (checkDeleteAccount.status === "Inactive") {
      res.status(HTTP.OK).json({
        success: true,
        response: checkDeleteAccount,
        message: "Remove Account Succesfully!!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Remove Account Failed!!",
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, role } = req.body;

    let checkExistUser = await userModel.findOne({ email });

    if (checkExistUser)
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ succes: false, error: EXCEPTIONS.USER_HAS_EXIST });

    let user = new userModel({
      email,
      password: "12345678",
      firstName,
      lastName,
      phoneNumber,
      role,
    });

    const checkUser = await user.save();

    if (checkUser) {
      res.status(200).json({
        success: true,
        response: user,
        message: "Create Account successfully!",
      });
    } else {
      res
        .status(HTTP.INTERNAL_SERVER_ERROR)
        .json({ message: "Create Account Fail" });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: "Create Account Fail",
    });
  }
};

const banAccount = async (req, res) => {
  try {
    const _id = req.params.id;

    const checkDeleteAccount = await userModel.findOneAndUpdate(
      { _id },
      { status: "Banned" },
      { new: true }
    );

    if (checkDeleteAccount.status === "Banned") {
      res.status(HTTP.OK).json({
        success: true,
        response: checkDeleteAccount,
        message: "Ban Account Succesfully!!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Ban Account Failed!!",
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const unbanAccount = async (req, res) => {
  try {
    const _id = req.params.id;

    const checkDeleteAccount = await userModel.findOneAndUpdate(
      { _id },
      { status: "Active" },
      { new: true }
    );

    if (checkDeleteAccount.status === "Active") {
      res.status(HTTP.OK).json({
        success: true,
        response: checkDeleteAccount,
        message: "Unban Account Succesfully!!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Unban Account Failed!!",
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllAccount,
  getAccountByRole,
  changeAccountPassword,
  deleteAccount,
  banAccount,
  unbanAccount,
  createAccount,
};
