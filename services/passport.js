const passport = require("passport");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const { generateTokens } = require("../utils/generateAccountToken");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user) => {
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
          const existingUser = await userModel.findOne({
            email: profile.email,
          });

          if (existingUser) {
            done(null, existingUser);
          } else {
            const account = new userModel({
              email: profile.email,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.email,
              isVerified: true,
            });

            const checkAccount = await account.save();

            if (checkAccount) {
              done(null, checkAccount);
            }
          }
        }
      } catch (error) {
        console.error("Error during Google authentication:", error);
        done(error, null);
      }
    }
  )
);
