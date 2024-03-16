const express = require("express");
const {
  createBill,
  getBill,
  getUserBill,
  checkAlreadyPay,
  createNewBill,
} = require("../controller/bill.controller");

const router = express.Router();

router.get("/member/:id", getUserBill);

router.get("/checkAlreadyPay/:memberID/:auctionID", checkAlreadyPay);

router.post("/createBill/:memberID", createBill);

router.post("/newBill/:memberID", createNewBill);

router.post("/getBill/:id", getBill);

module.exports = router;
