const mongoose = require("mongoose");

const accountTokenSchema = new mongoose.Schema(
  {
    accountID: { type: mongoose.Schema.Types.ObjectId, required: true },
    verifyToken: { type: String },
    verifyTokenExpires: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

const accountTokenModel = mongoose.model("Account-Token", accountTokenSchema);

module.exports = accountTokenModel;
