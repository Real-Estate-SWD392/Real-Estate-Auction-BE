const express = require("express");
const {
  createBid,
  getBidByAuction,
  getUserBid,
  updateNewBid,
  getWinBid,
} = require("../controller/bid.controller");

const router = express.Router();

router.get("/auction/:auctionID", getBidByAuction);
router.get("/user/:id", getUserBid);
router.get("/win/:id", getWinBid);
router.post("/", createBid);
router.put("/", updateNewBid);

module.exports = router;
