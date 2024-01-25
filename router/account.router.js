const express = require("express");
const {
  loginAccount,
  registerAccount,
  verifyEmail,
} = require("../controller/account.controller");
const { registerValidator } = require("../validators/account.validator");

const router = express.Router();

router.post("/login", loginAccount);
router.post("/register", registerValidator, registerAccount);
router.get("/verify-email", verifyEmail);

module.exports = router;
