const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, minLength: 5, required: true, unique: true },

    password: { type: String, minLength: 5 },

    firstName: { type: String, minLength: 2, required: true },

    lastName: { type: String, minLength: 2, required: true },

    phoneNumber: { type: String, minLength: 10 },

    street: { type: String, minLength: 2 },

    district: { type: String, minLength: 2 },

    city: { type: String, minLength: 2 },

    idCard: [{ type: String }],

    favoriteList: [{ type: Object }],

    isVerified: { type: Boolean, default: false },

    verifyToken: { type: String },

    verifyTokenExpires: { type: Date },

    resetToken: { type: String },

    resetTokenExpires: { type: Date },

    role: {
      type: String,
      default: "member",
      enum: { values: ["admin", "staff", "member"] },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
