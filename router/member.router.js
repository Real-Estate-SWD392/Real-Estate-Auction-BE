const express = require("express");
const {
  getMemberByID,
  editProfileMemberByID,
  addAuctionToFavoriteList,
  ratingOwnerAuction,
  getBidListByMember,
} = require("../controller/member.controller");

const router = express.Router();

router.get("/:id", getMemberByID);
router.get("/bid-list/:id", getBidListByMember);
router.patch("/update-profile/:id", editProfileMemberByID);
router.put("/add-favorite-auction/:id", addAuctionToFavoriteList);
router.post("/rating-owner-auction/:id", ratingOwnerAuction);

module.exports = router;
