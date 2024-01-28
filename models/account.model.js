const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const accountSchema = new mongoose.Schema(
  {
    email: { type: String, minLength: 5, require: true, unique: true },
    password: { type: String, minLength: 5, require: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      default: "member",
      enum: { values: ["admin", "staff", "member"] },
    },
  },
  { timestamps: true }
);

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
