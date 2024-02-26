const chatBoxModel = require("../models/chat-box.model");
const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");

// create chat
const createChatBox = async (req, res) => {
  try {
    const { firstID, secondID } = req.body;

    const chat = await chatBoxModel.findOne({
      members: { $all: [firstID, secondID] },
    });

    console.log(chat);

    if (chat)
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "This Chat Box Is Existed" });

    const newChat = new chatBoxModel({
      members: [firstID, secondID],
    });

    const response = await newChat.save();

    if (response) {
      res.status(HTTP.INSERT_OK).json({ success: true, response });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, error: "Fail to create box chat" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

// find user chat (chat room that user is in)
const findChatBoxByUser = async (req, res) => {
  try {
    const userID = req.params.id;

    const chatboxes = await chatBoxModel.find({
      members: { $in: [userID] },
    });

    if (chatboxes) {
      res.status(HTTP.OK).json({ success: true, response: chatboxes });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, error: "Fail to find chat box" });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const findChatBox = async (req, res) => {
  try {
    const { firstID, secondID } = req.params;

    const chatbox = await chatBoxModel
      .find({
        members: { $all: [firstID, secondID] },
      })
      .populate("members");

    if (chatbox) {
      res.status(HTTP.OK).json(chatbox);
    } else {
      res
        .status(HTTP.NOT_FOUND)
        .json({ success: false, message: "Chat box not found!" });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = { createChatBox, findChatBox, findChatBoxByUser };
