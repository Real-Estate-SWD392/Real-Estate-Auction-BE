const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    startPrice: { type: Number, required: true },

    priceStep: { type: Number, min: 0, required: true },

    day: { type: Number, min: 0 },

    hour: { type: Number, min: 0, max: 24 },

    minute: { type: Number, min: 0, max: 60 },

    second: { type: Number, min: 0, max: 60 },

    numberOfBidder: { type: Number, min: 0, default: 0 },

    description: { type: String, required: true },

    status: {
      type: String,
      default: "Wait For Approval",
      enum: {
        values: [
          "Wait For Approval",
          "Not Start",
          "In Auction",
          "End",
          "Cancel",
        ],
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
      default: "Wait For Approval",
      enum: {
        values: ["Wait For Approval", "Accepted", "Denied"],
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
