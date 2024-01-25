const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    startPrice: { type: Number, require: true },
    priceStep: { type: Number, min: 0, require: true },
    numberOfBidder: { type: Number, min: 0, default: 0 },
    description: { type: String },
    status: {
      type: String,
      enum: { values: ["Wait For Approval", "Not Start", "In Auction", "End"] },
    },
    buyNowPrice: { type: Number },
    realEstateID: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true }
);

const auctionModel = mongoose.model("Auction", auctionSchema);

module.exports = auctionModel;
