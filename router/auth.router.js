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
  logoutAccount,
} = require("../controller/auth.controller");
const { generateTokens } = require("../utils/generateAccountToken");
require("../services/passport");

const router = express.Router();

router.get("/verify-email", verifyEmail);

router.post("/login", loginValidator, loginAccount);
router.post("/register", registerValidator, registerAccount);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/logout", logoutAccount);

// LOGIN WITH GOOGLE (OAUTH2)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "google/failure",
  })
);

router.get("/google/success", async (req, res) => {
  const user = req.user;

  if (user) {
    const { accessToken, refreshToken } = await generateTokens(user);

    res
      .cookie("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
      })
      .header("authorization", `Bearer ${accessToken}`)
      .status(HTTP.OK)
      .json({
        succes: true,
        response: user,
        accessToken,
        refreshToken,
        message: "Logged Google Successfully",
      });
  }
});

router.get("/google/failure", (req, res) => {
  res
    .status(HTTP.BAD_REQUEST)
    .json({ success: false, message: "Login with Google fail!" });
});

module.exports = router;
