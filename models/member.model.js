const mongoose = require("mongoose");

const memberSchema = mongoose.Schema(
  {
    accountID: { type: mongoose.Types.ObjectId },
    email: { type: String, minLength: 5, require: true, unique: true },
    firstName: { type: String, minLength: 2, require: true },
    lastName: { type: String, minLength: 2, require: true },
    phoneNumber: { type: String, minLength: 10, require: true },
    idCard: [{ type: String }],
  },
  { timestamps: true }
);

const memberModel = mongoose.model("Member", memberSchema);

module.exports = { memberModel };
