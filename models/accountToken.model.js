const mongoose = require("mongoose");

const accountTokenSchema = new mongoose.Schema(
  {
    accountID: { type: mongoose.Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 30 * 86400 },
  },
  { timestamps: true }
);

const accountTokenModel = mongoose.model("Account-Token", accountTokenSchema);

module.exports = accountTokenModel;
