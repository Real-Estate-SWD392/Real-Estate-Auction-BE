const express = require("express");
const {
  loginAccount,
  registerAccount,
  verifyEmail,
  logoutAccount,
} = require("../controller/account.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/account.validator");

const router = express.Router();

router.post("/login", loginValidator, loginAccount);
router.post("/register", registerValidator, registerAccount);
router.get("/verify-email", verifyEmail);
router.delete("/logout", logoutAccount);

module.exports = router;
