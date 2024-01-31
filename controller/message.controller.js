const messageModel = require("../models/message.model");
const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");

const createMessage = async (req, res) => {
  try {
    const { chatboxID, senderID, text } = req.body;

    const message = new messageModel({
      chatboxID,
      senderID,
      text,
    });

    const response = await message.save();
    res.status(HTTP.INSERT_OK).json({ success: true, response });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatBoxID } = req.params;
    const messages = await messageModel.find({ chatBoxID });
    res.status(HTTP.OK).json({ success: true, response: messages });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = { createMessage, getMessages };
