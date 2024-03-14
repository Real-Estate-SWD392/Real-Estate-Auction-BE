const express = require("express");
const {
  deleteAccount,
  changeAccountPassword,
  getAccountByRole,
  getAllAccount,
  banAccount,
  unbanAccount,
  createAccount,
} = require("../controller/account.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/account.validator");
const { ADMIN_ROLE, STAFF_ROLE, MEMBER_ROLE } = require("../constant/role");
const authorization = require("../utils/authorization");

const router = express.Router();

router.get("/", authorization([ADMIN_ROLE]), getAllAccount);

router.post("/", authorization([ADMIN_ROLE]), createAccount);

router.get("/role/:role", authorization([ADMIN_ROLE]), getAccountByRole);

router.put(
  "/changePassword/:id",
  authorization([MEMBER_ROLE, STAFF_ROLE, ADMIN_ROLE]),
  changeAccountPassword
);

router.put("/remove/:id", authorization([ADMIN_ROLE]), deleteAccount);
router.put("/ban/:id", authorization([ADMIN_ROLE]), banAccount);
router.put("/unban/:id", authorization([ADMIN_ROLE]), unbanAccount);

module.exports = router;
