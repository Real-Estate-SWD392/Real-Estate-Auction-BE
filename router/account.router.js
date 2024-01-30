const express = require("express");
const {
  deleteAccount,
  changeAccountPassword,
  getAccountByRole,
} = require("../controller/account.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/account.validator");

const router = express.Router();

router.get("/role/:role", getAccountByRole);

router.put("/changePassword/:id", changeAccountPassword);

router.put("/:id", deleteAccount);

module.exports = router;
