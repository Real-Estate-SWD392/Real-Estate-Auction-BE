const express = require("express");
const passport = require("passport");
require("../services/passport");

const router = express.Router();

router.get(
  "/google",
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
  res.redirect("http://localhost:3000/homepage");
});

router.get("/google/failure", (req, res) => {
  res.send("Fail");
});

module.exports = router;
