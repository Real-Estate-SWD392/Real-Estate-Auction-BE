const mongoose = require("mongoose");

const chatBoxSchema = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

const chatBoxModel = mongoose.model("ChatBox", chatBoxSchema);

module.exports = chatBoxModel;
