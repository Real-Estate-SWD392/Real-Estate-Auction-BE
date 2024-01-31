const express = require("express");
const {
  createChatBox,
  findChatBoxByUser,
  findChatBox,
} = require("../controller/chat-box.controller");

const router = express.Router();

router.post("/", createChatBox);
router.get("/:id", findChatBoxByUser);
router.get("/find/:firstID/:secondID", findChatBox);

module.exports = router;
