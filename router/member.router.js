const express = require("express");
const {
  getMemberByID,
  editProfileMemberByID,
  addAuctionToFavoriteList,
} = require("../controller/member.controller");

const router = express.Router();

router.get("/:id", getMemberByID);
router.put("/update-profile/:id", editProfileMemberByID);
router.put("/add-favorite-auction/:id", addAuctionToFavoriteList);

module.exports = router;
