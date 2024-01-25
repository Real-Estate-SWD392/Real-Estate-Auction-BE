const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTIONS = require("../exceptions/Exceptions");
const auctionModel = require("../models/auction.model");
const joinListMemberModel = require("../models/join-list-member.model");

const getAuctionByID = async (req, res) => {
  try {
    const _id = req.params.id;

    const auction = await auctionModel.findOne({ _id });

    if (auction) {
      res.status(HTTP.OK).json({
        success: true,
        response: auction,
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

const getAuctionByStatus = async (req, res) => {
  try {
    const status = req.query.status;

    const auction = await auctionModel.find({ status: status });

    if (auction.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: auction,
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

const getAuctionByName = async (req, res) => {
  try {
    const name = req.query.name;

    const regex = new RegExp(name, "i"); // 'i' flag for case-insensitive matching

    const auction = await auctionModel.find({
      name: { $regex: regex },
    });

    if (auction.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: auction,
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

const createAuction = async (req, res) => {
  try {
    const {
      name,
      startPrice,
      priceStep,
      description,
      status,
      buyNowPrice,
      realEstateID,
    } = req.body;

    const newAuction = new auctionModel({
      name,
      startPrice,
      priceStep,
      description,
      status,
      buyNowPrice,
      realEstateID,
    });

    const checkAuction = await newAuction.save();

    if (checkAuction) {
      const newList = new joinListMemberModel({
        auctionID: checkAuction._id,
      });

      const checkNewList = await newList.save();

      if (checkNewList)
        res.status(HTTP.INSERT_OK).json({
          success: true,
          result: newAuction,
        });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_CREATE_ITEM,
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const removeAuction = async (req, res) => {
  try {
    const _id = req.params.id;

    const checkRemoveAuction = await auctionModel.deleteOne({ _id });

    if (checkRemoveAuction.deletedCount > 0) {
      const checkRemoveList = await joinListMemberModel.deleteOne({
        auctionID: _id,
      });

      if (checkRemoveList.deletedCount > 0) {
        res.status(HTTP.OK).json({
          success: true,
          response: checkRemoveAuction,
        });
      }
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_DELETE_ITEM,
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  getAuctionByID,
  getAuctionByStatus,
  getAuctionByName,
  createAuction,
  removeAuction,
};
