const express = require("express");
const {
  getBalance,
  addMoney,
  payMoney,
} = require("../controller/e-wallet.controller");

const router = express.Router();

router.get("/:id", getBalance);
router.put("/add/:id", addMoney);
router.put("/pay/:id", payMoney);

module.exports = router;
