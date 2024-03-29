const mongoose = require("mongoose");

const chatBoxSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const chatBoxModel = mongoose.model("ChatBox", chatBoxSchema);

module.exports = chatBoxModel;
