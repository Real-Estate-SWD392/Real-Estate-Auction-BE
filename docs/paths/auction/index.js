const getAllAuction = require("./getAllAuction");
const putCalendar = require("./putCalendar");
const postCalendar = require("./postCalendar");
const deleteCalendar = require("./deleteCalendar");
module.exports = {
  "/auction": {
    ...getAllAuction,
  },
  "/calendar/{calendarId}": {
    ...putCalendar,
    ...deleteCalendar,
  },
};
