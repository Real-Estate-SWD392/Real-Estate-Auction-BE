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
  deleteAuctionByStaff,
  handleAuctionRequest,
} = require("../controller/auction.controller");
const authenticateJWT = require("../utils/authenticateJWT");
const authorization = require("../utils/authorization");
const { STAFF_ROLE, MEMBER_ROLE } = require("../constant/role");

const router = express.Router();

router.get("/", getAllAuction);

router.get("/name/:name", getAuctionByName);

router.get("/ID/:id", getAuctionByID);

router.get("/status/:status", getAuctionByStatus);

router.get("/joinList/:auctionID", getJoinListMemberByAuctionID);

router.get("/sort/time", sortAuctionByTime);
router.get("/filter", filterAuction);

router.post(
  "/",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE]),
  createAuction
);

router.put(
  "/:id",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE]),
  updateAuction
);
router.put(
  "/addMember/:auctionID/:accountID",
  authenticateJWT,
  authorization([MEMBER_ROLE]),
  addMemberToList
);
router.put(
  "/removeMember/:auctionID/:accountID",
  authenticateJWT,
  authorization([STAFF_ROLE]),
  removeMemberFromList
);

router.put(
  "/remove/:id",
  authenticateJWT,
  authorization([STAFF_ROLE]),
  removeAuction
);

router.delete(
  "/deleteAuction/:id",
  authenticateJWT,
  authorization([STAFF_ROLE]),
  deleteAuctionByStaff
);
router.put(
  "/handleAuctionRequest/:id",
  authenticateJWT,
  authorization([STAFF_ROLE]),
  handleAuctionRequest
);

module.exports = router;
