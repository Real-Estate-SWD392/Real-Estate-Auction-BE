const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const Token = require("../config/vnpay");
const billModel = require("../models/bill.model");
const moment = require("moment");

const createBill = async (req, res) => {
  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  const { memberID } = req.params;

  const { auctionID, total, payment, type } = req.body;

  const newBill = await new billModel({
    memberID,
    auctionID,
    total,
    payment,
    type,
  }).save();

  console.log(newBill);

  process.env.TZ = "Asia/Ho_Chi_Minh";
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = Token;

  var tmnCode = config.vnp_TmnCode;
  var secretKey = config.vnp_HashSecret;
  var vnpUrl = config.vnp_Url;
  var returnUrl = config.vnp_ReturnUrl;

  var date = new Date();

  var createDate = moment(date).format("YYYYMMDDHHmmss");
  //   var orderId = dateFormat(date, "HHmmss");
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;

  var orderInfo = req.body.orderDescription;
  var orderType = req.body.orderType;
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = newBill._id;
  vnp_Params["vnp_OrderInfo"] = type;
  vnp_Params["vnp_OrderType"] = payment;
  vnp_Params["vnp_Amount"] = total * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl + "bill/" + newBill._id;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  console.log(vnpUrl);

  res.status(HTTP.OK).json({ url: vnpUrl });
};

const getBill = async (req, res) => {
  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  const { id } = req.params;

  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let config = Token;
  var tmnCode = config.vnp_TmnCode;
  var secretKey = config.vnp_HashSecret;

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  //   console.log("Request query:", signData);
  console.log("Generated signature:", signed);
  console.log("Received signature:", secureHash);

  if (secureHash === signed) {
    // Signature matched, proceed with processing the payment

    if (req.query.vnp_TransactionStatus == "00") {
      const updateBill = await billModel
        .findOneAndUpdate({ _id: id }, { status: "Success" }, { new: true })
        .populate([
          {
            path: "auctionID",
          },
          { path: "memberID" },
        ]);

      res.status(HTTP.OK).json({
        success: true,
        message: "Update Bill Successfully",
        response: updateBill,
      });
    } else {
      const updateBill = await billModel
        .findOneAndUpdate({ _id: id }, { status: "Fail" }, { new: true })
        .populate([
          {
            path: "auctionID",
          },
          { path: "memberID" },
        ]);

      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Update Bill Fail",
        response: updateBill,
      });
    }
  } else {
    // Signature mismatch, indicating potential tampering
    res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Signature mismatch. Potential tampering detected.",
    });
  }
};

const getUserBill = async (req, res) => {
  try {
    const memberID = req.params.id;

    const bill = await billModel
      .find({ memberID })
      .sort({ createdAt: -1 })
      .populate("memberID");

    res.status(HTTP.OK).json({ success: true, response: bill });
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error });
  }
};

const createNewBill = async (req, res) => {
  try {
    const { memberID } = req.params;

    const { auctionID, total, payment, type } = req.body;

    const newBill = await new billModel({
      memberID,
      auctionID,
      total,
      payment,
      type,
      status: "Success",
    }).save();

    res.status(HTTP.OK).json({ success: true, response: newBill });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error });
  }
};

const checkAlreadyPay = async (req, res) => {
  try {
    const memberID = req.params.memberID;
    const auctionID = req.params.auctionID;

    let check = false;

    const bill = await billModel
      .find({
        memberID,
        auctionID,
        status: "Success",
        type: { $in: ["Pay Winning Auction", "Buy Now"] },
      })
      .populate("memberID");

    console.log(bill);

    if (bill.length > 0) check = true;

    res.status(HTTP.OK).json({ success: true, response: check });
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error });
  }
};

module.exports = {
  createBill,
  getBill,
  getUserBill,
  checkAlreadyPay,
  createNewBill,
};
