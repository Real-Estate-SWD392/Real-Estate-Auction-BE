const express = require("express");
const {
  getMemberByID,
  editProfileMemberByID,
  addAuctionToFavoriteList,
  ratingOwnerAuction,
} = require("../controller/member.controller");

const router = express.Router();

router.get("/:id", getMemberByID);
router.patch("/update-profile/:id", editProfileMemberByID);
router.put("/add-favorite-auction/:id", addAuctionToFavoriteList);
router.post("/rating-owner-auction/:id", ratingOwnerAuction);

module.exports = router;
