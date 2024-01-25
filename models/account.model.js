const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    email: { type: String, minLength: 5, require: true, unique: true },
    password: { type: String, minLength: 5, require: true },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String },
    role: {
      type: String,
      default: "member",
      enum: { values: ["admin", "staf", "member"] },
    },
  },
  { timestamps: true }
);

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
