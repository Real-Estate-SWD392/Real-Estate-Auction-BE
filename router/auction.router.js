const express = require("express");
const {
  getAuctionByID,
  createAuction,
  getAuctionByStatus,
  getAuctionByName,
  removeAuction,
  getAllAuction,
  updateAuction,
  addMemberToList,
  removeMemberFromList,
  getJoinListMemberByAuctionID,
  sortAuctionByTime,
  filterAuction,
} = require("../controller/auction.controller");

const router = express.Router();

router.get("/", getAllAuction);
router.get("/name/:name", getAuctionByName);
router.get("/ID/:id", getAuctionByID);
router.get("/status/:status", getAuctionByStatus);
router.get("/joinList/:auctionID", getJoinListMemberByAuctionID);
router.get("/sort/time", sortAuctionByTime);
router.get("/filter", filterAuction);

router.post("/", createAuction);

router.put("/:id", updateAuction);
router.put("/addMember/:auctionID/:accountID", addMemberToList);
router.put("/removeMember/:auctionID/:accountID", removeMemberFromList);

router.put("/remove/:id", removeAuction);

module.exports = router;
