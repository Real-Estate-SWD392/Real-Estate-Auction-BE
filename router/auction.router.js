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
const authenticateJWT = require("../utils/authenticateJWT");

const router = express.Router();

router.get("/", getAllAuction);

router.get("/name/:name", getAuctionByName);

router.get("/ID/:id", getAuctionByID);

router.get("/status/:status", getAuctionByStatus);

router.get("/joinList/:auctionID", getJoinListMemberByAuctionID);

router.get("/sort/time", sortAuctionByTime);
router.get("/filter", filterAuction);

router.post("/", authenticateJWT, createAuction);

router.put("/:id", authenticateJWT, updateAuction);
router.put(
  "/addMember/:auctionID/:accountID",
  authenticateJWT,
  addMemberToList
);
router.put(
  "/removeMember/:auctionID/:accountID",
  authenticateJWT,
  removeMemberFromList
);

router.put("/remove/:id", authenticateJWT, removeAuction);

module.exports = router;
