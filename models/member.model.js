const mongoose = require("mongoose");

const memberSchema = mongoose.Schema(
  {
    accountID: { type: mongoose.Types.ObjectId },
    email: { type: String, minLength: 5, required: true, unique: true },
    firstName: { type: String, minLength: 2, required: true },
    lastName: { type: String, minLength: 2, required: true },
    phoneNumber: { type: String, minLength: 10, required: true },
    idCard: [{ type: String }],
    favoriteList:[{type: Object}]
  },
  { timestamps: true }
);

const memberModel = mongoose.model("Member", memberSchema);

module.exports = { memberModel };
