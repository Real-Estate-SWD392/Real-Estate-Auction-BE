const express = require("express");
const passport = require("passport");
const HTTP = require("../HTTP/HttpStatusCode");
const {
  loginValidator,
  registerValidator,
} = require("../validators/account.validator");
const {
  registerAccount,
  loginAccount,
  forgotPassword,
  verifyEmail,
  resetPassword,
} = require("../controller/auth.controller");
require("../services/passport");

const router = express.Router();

router.get("/verify-email", verifyEmail);

router.post("/login", loginValidator, loginAccount);
router.post("/register", registerValidator, registerAccount);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

// LOGIN WITH GOOGLE (OAUTH2)
router.get(
  "/google",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/google/success", (req, res) => {
  res.status(HTTP.OK).json({ success: true, response: req.user });
});

router.get("/google/failure", (req, res) => {
  res
    .status(HTTP.BAD_REQUEST)
    .json({ success: false, message: "Login with Google fail!" });
});

module.exports = router;
