const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTIONS = require("../exceptions/Exceptions");
const joinListMemberModel = require("../models/join-list-member.model");

const getJoinListMemberByAuctionID = async (req, res) => {
  try {
    const auctionID = req.params.auctionID;

    const joinListMember = await joinListMemberModel.findOne({
      auctionID: auctionID,
    });

    if (joinListMember) {
      res.status(HTTP.OK).json({
        success: true,
        response: joinListMember,
      });
    } else {
      res.status(HTTP.NOT_FOUND).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_GET_ITEM,
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const checkIsMemberInList = async (req, res) => {
  try {
    const { memberID, auctionID } = req.query;

    const checkMember = await joinListMemberModel.findOne({
      auctionID: auctionID,
      memberID: { $in: [memberID] },
    });

    if (checkMember) {
      res.status(HTTP.OK).json({
        success: true,
        response: checkMember,
      });
    } else {
      res.status(HTTP.NOT_FOUND).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_GET_ITEM,
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const addMemberToList = async (req, res) => {
  try {
    const { auctionID, memberID } = req.body;

    const joinList = await joinListMemberModel.findOne({
      auctionID: auctionID,
    });

    if (joinList) {
      const checkUpdate = await joinListMemberModel.updateOne(
        { _id: joinList._id },
        { $addToSet: { memberID: memberID } }
      );

      if (!checkUpdate.modifiedCount > 0) {
        res.status(HTTP.BAD_REQUEST).json({
          success: false,
          error: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
        });
      } else {
        res.status(HTTP.OK).json({
          success: true,
          response: checkUpdate,
        });
      }
    } else {
      res.status(HTTP.NOT_FOUND).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_GET_ITEM,
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  getJoinListMemberByAuctionID,
  addMemberToList,
  checkIsMemberInList,
};
