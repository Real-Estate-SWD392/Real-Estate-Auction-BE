const express = require("express");
const { getMemberByID } = require("../controller/member.controller");

const router = express.Router();

router.get("/:id", getMemberByID);

module.exports = router;
