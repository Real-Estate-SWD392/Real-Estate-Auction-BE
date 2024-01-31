const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatBoxID: String,
    senderID: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
