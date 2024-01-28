const express = require("express");
const {
  getAuctionByID,
  createAuction,
  getAuctionByStatus,
  getAuctionByName,
  removeAuction,
  getAllAuction,
  updateAuction,
} = require("../controller/auction.controller");

const router = express.Router();

router.get("/", getAllAuction);
router.get("/name/:name", getAuctionByName);
router.get("/ID/:id", getAuctionByID);
router.get("/status/:status", getAuctionByStatus);

router.post("/", createAuction);

router.put("/", updateAuction);

router.delete("/:id", removeAuction);

module.exports = router;
