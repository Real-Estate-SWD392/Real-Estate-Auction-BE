const getNotification = require("./getNotification");
const putNotification = require("./putNotification");
const postNotification = require("./postNotification");
const deleteNotification = require("./deleteNotification");
module.exports = {
  "/notification/{userId}": {
    ...getNotification,
    ...postNotification,
  },
  "/notification/{notificationId}": {
    ...putNotification,
    ...deleteNotification,
  },
};
