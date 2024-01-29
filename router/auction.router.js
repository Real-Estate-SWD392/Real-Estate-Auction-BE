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
} = require("../controller/auction.controller");

const router = express.Router();

router.get("/", getAllAuction);
router.get("/name/:name", getAuctionByName);
router.get("/ID/:id", getAuctionByID);
router.get("/status/:status", getAuctionByStatus);
router.get("/joinList/:auctionID", getJoinListMemberByAuctionID);

router.post("/", createAuction);

router.put("/", updateAuction);
router.put("/addMember", addMemberToList);
router.put("/removeMember", removeMemberFromList);

router.delete("/:id", removeAuction);

module.exports = router;
