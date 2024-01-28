const express = require("express");
const {
  loginAccount,
  registerAccount,
  verifyEmail,
  logoutAccount,
  getAllAccounts,
  deleteAccount,
  changeAccountPassword,
  forgotPassword,
  resetPassword,
} = require("../controller/account.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/account.validator");

const router = express.Router();

router.get("/verify-email", verifyEmail);
router.get("/account", getAllAccounts);

router.post("/login", loginValidator, loginAccount);
router.post("/register", registerValidator, registerAccount);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

router.put("/account/changePassword", changeAccountPassword);

router.delete("/logout", logoutAccount);
router.delete("/account/:id", deleteAccount);

module.exports = router;
