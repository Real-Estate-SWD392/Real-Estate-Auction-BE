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

  const { auctionID, total, payment } = req.body;

  const newBill = await new billModel({
    memberID,
    auctionID,
    total,
    payment,
  }).save();

  console.log(newBill._id);

  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  let config = Token;

  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  let returnUrl = config.vnp_ReturnUrl;
  let orderId = moment(date).format("DDHHmmss");
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = newBill._id;
  vnp_Params["vnp_OrderInfo"] = "Pay For Bill:" + newBill._id;
  vnp_Params["vnp_OrderType"] = newBill.payment;
  vnp_Params["vnp_Amount"] = total * 100;
  // đường dẫn trả về khi thanh toán
  vnp_Params["vnp_ReturnUrl"] = returnUrl + "bill/" + newBill._id;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  console.log(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });

  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  console.log(querystring.stringify(vnp_Params, { encode: false }));

  res.json({ url: vnpUrl });
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

  const { memberID } = req.params;

  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let config = Token;
  //   let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  //   console.log("Request query:", signData);
  //   console.log("Generated signature:", signed);
  //   console.log("Received signature:", secureHash);

  //   if (secureHash === signed) {
  // Signature matched, proceed with processing the payment

  if (req.query.vnp_TransactionStatus == "00") {
    const updateBill = await billModel.findOneAndUpdate(
      { _id: memberID },
      { status: "Success" },
      { new: true }
    );

    res
      .status(HTTP.OK)
      .json({ message: "Update Bill Successfully", response: updateBill });
  } else {
    const updateBill = await billModel.findOneAndUpdate(
      { _id: id },
      { status: "Fail" },
      { new: true }
    );

    res
      .status(HTTP.BAD_REQUEST)
      .json({ message: "Update Bill Fail", response: updateBill });
  }
  //   } else {
  //     // Signature mismatch, indicating potential tampering
  //     res.status(HTTP.BAD_REQUEST).json({
  //       success: false,
  //       message: "Signature mismatch. Potential tampering detected.",
  //     });
  //   }
};

module.exports = { createBill, getBill };
