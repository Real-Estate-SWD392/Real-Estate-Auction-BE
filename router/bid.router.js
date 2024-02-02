const express = require("express");
const { createBid, getBidByAuction } = require("../controller/bid.controller");

const router = express.Router();

router.get("/:auctionID", getBidByAuction);
router.post("/", createBid);

module.exports = router;
