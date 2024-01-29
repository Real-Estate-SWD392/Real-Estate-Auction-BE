const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    startPrice: { type: Number, require: true },
    priceStep: { type: Number, min: 0, require: true },
    day: { type: Number, min: 0 },
    hour: { type: Number, min: 0, max: 24 },
    minute: { type: Number, min: 0, max: 60 },
    second: { type: Number, min: 0, max: 60 },
    numberOfBidder: { type: Number, min: 0, default: 0 },
    description: { type: String },
    status: {
      type: String,
      enum: { values: ["Wait For Approval", "Not Start", "In Auction", "End"] },
    },
    buyNowPrice: { type: Number },
    realEstateID: { type: mongoose.Types.ObjectId },
    joinList: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Member" }],
      default: [],
    },
  },
  { timestamps: true }
);

const auctionEnums = {
  status: auctionSchema.path("status").enumValues,
};

const auctionModel = mongoose.model("Auction", auctionSchema);

module.exports = { auctionModel, auctionEnums };
