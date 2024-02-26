const express = require("express");
const {
  deleteAccount,
  changeAccountPassword,
  getAccountByRole,
  getAllAccount,
  banAccount,
} = require("../controller/account.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/account.validator");
const { ADMIN_ROLE, STAFF_ROLE, MEMBER_ROLE } = require("../constant/role");
const authorization = require("../utils/authorization");

const router = express.Router();

router.get("/", authorization([ADMIN_ROLE]), getAllAccount);

router.get("/role/:role", authorization([ADMIN_ROLE]), getAccountByRole);

router.put(
  "/changePassword/:id",
  authorization([MEMBER_ROLE, ADMIN_ROLE]),
  changeAccountPassword
);

router.put("/remove/:id", authorization([ADMIN_ROLE]), deleteAccount);
router.put("/ban/:id", authorization([ADMIN_ROLE]), banAccount);

module.exports = router;
