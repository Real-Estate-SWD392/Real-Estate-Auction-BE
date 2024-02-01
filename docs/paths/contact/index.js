const getAllContact = require("./getAllContact");
const postContact = require("./postContact");
const putContact = require("./putContact");
const deleteContact = require("./deleteContact");
module.exports = {
  "/contact": {
    ...getAllContact,
    ...postContact,
  },
  "/contact/{contactId}": {
    ...putContact,
    ...deleteContact,
  },
};
