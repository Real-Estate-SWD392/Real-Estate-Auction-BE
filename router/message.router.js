const express = require("express");
const {
  createMessage,
  getMessages,
} = require("../controller/message.controller");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatID", getMessages);

module.exports = router;
