const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const billSchema = new mongoose.Schema(
  {
    memberID: { type: String, ref: "User", required: true },
    auctionID: { type: String, ref: "Auction", required: true },
    total: { type: Number, required: true },
    payment: {
      type: String,
      maxLength: 255,
      enum: { values: ["Cash", "VNPay"] },
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Success", "Fail"],
      },
      default: "Pending", // Trạng thái mặc định là "Chờ xử lý"
    },

    type: {
      type: String,
      enum: {
        values: [
          "Pay Auction Fee",
          "Pay Winning Auction",
          "Buy Now",
          "Add Money To E-wallet",
        ],
      },
      required: true,
    },
  },
  { timestamps: true }
);

const billModel = mongoose.model("Bill", billSchema);

module.exports = billModel;
