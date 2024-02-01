const auth = require("./auth");
const post = require("./post");
const user = require("./user");
const auction = require("./auction");
const notification = require("./notification");
const order = require("./order");
const product = require("./product");
const contact = require("./contact");
const orderDetail = require("./orderDetail");
const variation = require("./variation");

module.exports = {
  paths: {
    ...auth,
    ...post,
    ...user,
    ...auction,
    ...notification,
    ...product,
    ...order,
    ...contact,
    ...orderDetail,
    ...variation,
  },
};
