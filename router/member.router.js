const express = require("express");
const {
  getMemberByID,
  editProfileMemberByID,
  addAuctionToFavoriteList,
  ratingOwnerAuction,
  getBidListByMember,
  removeAuctionFromFavoriteList,
} = require("../controller/member.controller");

const router = express.Router();

router.get("/:id", getMemberByID);
router.get("/bid-list/:id", getBidListByMember);
router.patch("/update-profile/:id", editProfileMemberByID);
router.put("/add-favorite-auction/:id", addAuctionToFavoriteList);
router.put(
  "/remove-favorite-auction/:auctionID",
  removeAuctionFromFavoriteList
);
router.post("/rating-owner-auction/:id", ratingOwnerAuction);

module.exports = router;
