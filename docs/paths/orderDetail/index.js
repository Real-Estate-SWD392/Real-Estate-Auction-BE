const allOrderDetail = require("./allOrderDetail");
const getOrderDetailById = require("./getOrderDetailById");
const addOrderDetail = require("./createOrderDetail");
const updateOrderDetail = require("./updateOrderDetail");
const deleteOrderDetail = require("./deleteOrderDetail");

module.exports = {
  "/orderDetail": {
    ...allOrderDetail,
    ...addOrderDetail,
  },
  "/orderDetail/{orderDetailID}": {
    ...getOrderDetailById,
    ...updateOrderDetail,
    ...deleteOrderDetail,
  },
};