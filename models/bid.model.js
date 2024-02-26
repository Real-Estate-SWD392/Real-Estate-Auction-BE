const mongoose = require("mongoose");

const bidSchema = mongoose.Schema(
  {
    userID: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    auctionID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Auction",
    },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const bidModel = mongoose.model("Bid", bidSchema);

module.exports = bidModel;
