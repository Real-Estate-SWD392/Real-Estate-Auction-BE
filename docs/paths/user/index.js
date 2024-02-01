const getAllUser = require("./getAllUser");
const getUserById = require("./getUserById");
const deleteUser = require("./deleteUserById");
const postCalendar = require("../auction/postCalendar");
const putCalendar = require("../auction/putCalendar");
const deleteCalendar = require("../auction/deleteCalendar");
const updateUser = require("./updateUser");
const createUser = require("./createUser");
const getUserBySignedIn = require("./getUserBySignedIn");
module.exports = {
  "/users": {
    ...getAllUser,
  },

  "/user": {
    ...getUserBySignedIn,
  },

  "/user/create": {
    ...createUser,
  },

  "/user/{userId}": {
    ...getUserById,
    ...deleteUser,
    ...updateUser,
  },
};
