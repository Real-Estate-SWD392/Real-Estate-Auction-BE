const Exceptions = require("../exceptions/Exceptions");
const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const ewalletModel = require("../models/e-wallet.model");

const getBalance = async (req, res) => {
  try {
    const ownerID = req.params.id;

    const wallet = await ewalletModel.findOne({ ownerID });

    if (wallet) {
      return res.status(HTTP.OK).json({
        success: true,

        response: wallet,
      });
    } else {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        error: "Get Wallet Fail",
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ error: Exceptions.INTERNAL_SERVER_ERROR });
  }
};

const addMoney = async (req, res) => {
  try {
    const ownerID = req.params.id;

    const { amount } = req.body;

    const checkExist = await ewalletModel.findOne({ ownerID });

    if (checkExist) {
      let newBalance = checkExist.balance + amount;

      checkExist.balance = newBalance;

      await checkExist.save();

      console.log(checkExist);
    } else {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ success: false, message: "Not Find User E-wallet" });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ error: Exceptions.INTERNAL_SERVER_ERROR });
  }
};

const payMoney = async (req, res) => {
  try {
    const ownerID = req.params.id;

    const { amount } = req.body;

    const checkExist = await ewalletModel.findOne({ ownerID });

    if (checkExist) {
      let newBalance = checkExist.balance - amount;

      checkExist.balance = newBalance;

      const checkUpdate = await checkExist.save();

      if (checkUpdate) {
        return res
          .status(HTTP.OK)
          .json({ success: true, response: checkUpdate });
      } else {
        return res
          .status(HTTP.BAD_REQUEST)
          .json({ success: false, message: "Pay Money Fail" });
      }
    } else {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ success: false, message: "Not Find User E-wallet" });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ error: Exceptions.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { getBalance, addMoney, payMoney };
