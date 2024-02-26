const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatBoxID: { type: String, ref: "ChatBox" },
    senderID: { type: String, ref: "User" },
    text: String,
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
