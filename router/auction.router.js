const express = require("express");
const {
  getAuctionByID,
  createAuction,
  getAuctionByStatus,
  getAuctionByName,
  removeAuction,
} = require("../controller/auction.controller");

const router = express.Router();

router.get("/getByName", getAuctionByName);
router.get("/getByID/:id", getAuctionByID);
router.get("/getByStatus", getAuctionByStatus);

router.post("/", createAuction);

router.delete("/:id", removeAuction);

module.exports = router;
