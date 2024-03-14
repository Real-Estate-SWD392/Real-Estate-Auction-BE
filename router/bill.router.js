const express = require("express");
const {
  createBill,
  getBill,
  getUserBill,
  checkAlreadyPay,
} = require("../controller/bill.controller");

const router = express.Router();

router.get("/member/:id", getUserBill);

router.get("/checkAlreadyPay/:memberID/:auctionID", checkAlreadyPay);

router.post("/:memberID", createBill);

router.post("/getBill/:id", getBill);

module.exports = router;
