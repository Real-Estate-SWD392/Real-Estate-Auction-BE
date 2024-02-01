const signIn = require("./signIn");
const signUp = require("./signUp");
const signOut = require("./signOut");
const verifyEmail = require("./verifyEmail");
module.exports = {
  "/auth/login": {
    ...signIn,
  },
  "/auth/register": {
    ...signUp,
  },
  "/auth/logout": {
    ...signOut,
  },
  "/auth/verifyEmail": {
    ...verifyEmail,
  },
};
