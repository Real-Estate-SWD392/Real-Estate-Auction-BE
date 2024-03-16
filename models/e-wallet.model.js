const mongoose = require("mongoose");

const ewalletSchema = mongoose.Schema({
  ownerID: { type: mongoose.Types.ObjectId, ref: "User" },
  balance: { type: Number, default: 0 },
});

const ewalletModel = mongoose.model("E-Wallet", ewalletSchema);

module.exports = ewalletModel;
