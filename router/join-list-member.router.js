const express = require("express");
const {
  getJoinListMemberByAuctionID,
  addMemberToList,
  checkIsMemberInList,
} = require("../controller/join-list-member.controller");

const router = express.Router();

router.get("/", checkIsMemberInList);
router.get("/:auctionID", getJoinListMemberByAuctionID);
router.put("/", addMemberToList);

module.exports = router;
