const allInvoice = require("./allInvoice");
const getInvoiceById = require("./getInvoiceById");
const addInvoice = require("./addInvoice");
const deleteInvoice = require("./deleteInvoice");

module.exports = {
  "/invoice": {
    ...allInvoice,
    ...addInvoice,
  },
  "/invoice/{invoiceID}": {
    ...deleteInvoice,
    ...getInvoiceById
  },
};