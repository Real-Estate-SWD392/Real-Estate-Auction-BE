const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    startPrice: { type: Number, required: true, default: 0 },

    priceStep: { type: Number, min: 0, required: true },

    currentPrice: { type: Number, default: 0 },

    day: { type: Number, min: 0, default: 0 },

    hour: { type: Number, min: 0, max: 24, default: 0 },

    minute: { type: Number, min: 0, max: 60, default: 0 },

    second: { type: Number, min: 0, max: 60, default: 0 },

    numberOfBidder: { type: Number, min: 0, default: 0 },

    winner: { type: String, ref: "User", default: "" },

    startDate: { type: Date },

    status: {
      type: String,
      default: "Requesting",
      enum: {
        values: ["Requesting", "Not Start", "In Auction", "End", "Cancel"],
      },
    },
    buyNowPrice: { type: Number },

    realEstateID: { type: mongoose.Types.ObjectId, ref: "Real-Estate" },

    joinList: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      default: [],
    },
    checkedStatus: {
      type: String,
      default: "Requesting",
      enum: {
        values: ["Requesting", "Accepted", "Denied"],
      },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const auctionEnums = {
  status: auctionSchema.path("status").enumValues,
};

const auctionModel = mongoose.model("Auction", auctionSchema);

module.exports = { auctionModel, auctionEnums };
