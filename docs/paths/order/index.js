const allOrder = require("./allOrder");
const getOrderById = require("./getOrderById");
const addOrder = require("./addOrder");
const updateOrder = require("./updateOrder");
const deleteOrder = require("./deleteOrder");

module.exports = {
  "/order": {
    ...allOrder,
    ...addOrder,
  },
  "/order/{orderID}": {
    ...getOrderById,
    ...updateOrder,
    ...deleteOrder,
  },
};