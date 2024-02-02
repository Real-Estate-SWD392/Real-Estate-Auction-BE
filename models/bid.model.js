const mongoose = require("mongoose");

const bidSchema = mongoose.Schema(
  {
    userID: { type: mongoose.Types.ObjectId, required: true },
    auctionID: { type: mongoose.Types.ObjectId, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const bidModel = mongoose.model("Bid", bidSchema);

module.exports = bidModel;
