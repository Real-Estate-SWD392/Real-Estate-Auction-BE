const passport = require("passport");
const { memberModel } = require("../models/member.model");
const accountModel = require("../models/account.model");
const { check } = require("express-validator");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  memberModel.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if google profile exists.
        if (profile) {
          const existingUser = await memberModel.findOne({
            email: profile.email,
          });
          if (existingUser) {
            done(null, existingUser);
          }

          const account = new accountModel({
            email: profile.email,
          });

          const checkAccount = await account.save();

          if (checkAccount) {
            const newMember = new memberModel({
              accountID: checkAccount._id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.email,
              name: profile.name.familyName + " " + profile.name.givenName,
            });

            await newMember.save();

            done(null, newMember);
          }
        }
      } catch (error) {
        console.error("Error during Google authentication:", error);
        done(error, null);
      }
    }
  )
);
