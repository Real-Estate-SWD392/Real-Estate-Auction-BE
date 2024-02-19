const HTTP = require("../HTTP/HttpStatusCode");
const accountModel = require("../models/account.model");
const bcrypt = require("bcrypt");
const EXCEPTIONS = require("../exceptions/Exceptions");
const { memberModel } = require("../models/member.model");
const userModel = require("../models/user.model");

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
      { isActive: false },
      { new: true }
    );

    const checkDeleteToken = await accountTokenModel.findOneAndUpdate(
      {
        accountID: _id,
      },
      { isActive: false },
      { new: true }
    );

    if (
      checkDeleteAccount.isActive === false &&
      checkDeleteToken.isActive === false
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
  getAccountByRole,
  changeAccountPassword,
  deleteAccount,
};
