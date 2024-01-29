const { default: mongoose } = require("mongoose");
const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTIONS = require("../exceptions/Exceptions");
const { auctionModel, auctionEnums } = require("../models/auction.model");
const addressModel = require("../models/address.model");

const getAllAuction = async (req, res) => {
  try {
    const auctions = await auctionModel.find({});

    if (auctions.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: auctions,
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
    const status = req.params.status;

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
    const name = req.params.name;

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

const sortAuctionByTime = async (req, res) => {
  try {
    const sortedAuctions = await auctionModel.find({}).sort({ createdAt: 1 });
    return res.status(HTTP.OK).json({
      success: true,
      response: sortedAuctions,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: "Sort failed",
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
    });
  }
};

const filterAuction = async (req, res) => {
  try {
    const validField = {};

    const values = req.query;

    Object.keys(values).map((key) => {
      if (values[key] !== "") {
        validField[key] = values[key];
      }
    });

    const filteredAuction = await auctionModel.find({ validField });

    res.status(HTTP.OK).json({
      success: true,
      response: filteredAuction,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
      message: "Filter Auction Fail!",
    });
  }
};

const createAuction = async (req, res) => {
  try {
    const {
      name,
      startPrice,
      priceStep,
      đay,
      hour,
      minute,
      second,
      description,
      status,
      buyNowPrice,
      realEstateID,
    } = req.body;

    const checkValidRealEstateID = await auctionModel.findOne({ realEstateID });

    if (checkValidRealEstateID)
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "This real estate is already in use",
      });

    const newAuction = new auctionModel({
      name,
      startPrice,
      priceStep,
      đay,
      hour,
      minute,
      second,
      description,
      status,
      buyNowPrice,
      realEstateID,
    });

    const checkAuction = await newAuction.save();

    if (checkAuction) {
      res.status(HTTP.INSERT_OK).json({
        success: true,
        result: checkAuction,
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

const getJoinListMemberByAuctionID = async (req, res) => {
  try {
    const auctionID = req.params.auctionID;

    const auction = await auctionModel.findOne({
      _id: auctionID,
    });

    if (auction.joinList.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: auction.joinList,
      });
    } else {
      res.status(HTTP.NOT_FOUND).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_GET_ITEM,
        message: "No one join this auction yet!!",
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const addMemberToList = async (req, res) => {
  try {
    const { auctionID, accountID } = req.body;

    const checkUpdate = await auctionModel.updateOne(
      { _id: auctionID },
      { $addToSet: { joinList: accountID } }
    );

    if (!checkUpdate.modifiedCount > 0) {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
        message: "Add member to list fail!",
      });
    } else {
      res.status(HTTP.OK).json({
        success: true,
        response: checkUpdate,
        message: "Add member to list successfully!",
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const removeMemberFromList = async (req, res) => {
  try {
    const { auctionID, accountID } = req.body;

    const auction = await auctionModel.findOne({ _id: auctionID });

    console.log(accountID);

    if (auction.joinList.length > 0) {
      const checkUpdate = await auctionModel.updateOne(
        { _id: auctionID },
        { $pull: { joinList: accountID } }
      );

      if (!checkUpdate.modifiedCount > 0) {
        res.status(HTTP.BAD_REQUEST).json({
          success: false,
          error: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
          message: "Remove member from list failed",
        });
      } else {
        res.status(HTTP.OK).json({
          success: true,
          response: checkUpdate,
          message: "Remove member from list successfully!",
        });
      }
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: "Join List is empty! Nothing to update!!",
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateAuction = async (req, res) => {
  try {
    const {
      _id,
      name,
      startPrice,
      priceStep,
      đay,
      hour,
      minute,
      second,
      description,
      status,
      buyNowPrice,
      realEstateID,
    } = req.body;

    const newValues = {
      name,
      startPrice,
      priceStep,
      đay,
      hour,
      minute,
      second,
      description,
      status,
      buyNowPrice,
      realEstateID: mongoose.Types.ObjectId.createFromHexString(realEstateID),
    };

    const isValidStatus = auctionEnums.status.find(
      (check) => check === newValues.status
    );

    const oldValues = await auctionModel.findOne(
      { _id },
      { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );

    const valuesChanged = Object.keys(newValues).some((key) => {
      const oldValueJSON = JSON.stringify(oldValues[key]);
      const newValueJSON = JSON.stringify(newValues[key]);

      return oldValueJSON !== newValueJSON;
    });

    if (valuesChanged && isValidStatus) {
      const checkUpdate = await auctionModel.updateOne(
        { _id },
        {
          newValues,
        }
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
          message: "Auction is updated",
        });
      }
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: "New values is the same with old values",
      });
    }
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(EXCEPTIONS.INTERNAL_SERVER_ERROR);
  }
};

const removeAuction = async (req, res) => {
  try {
    const _id = req.params.id;

    const checkRemoveAuction = await auctionModel.deleteOne({ _id });

    if (checkRemoveAuction.deletedCount > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: checkRemoveAuction,
        message: "Remove Auction Succesfully!!",
      });
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
  getAllAuction,
  getAuctionByID,
  getAuctionByStatus,
  getAuctionByName,
  createAuction,
  updateAuction,
  removeAuction,
  addMemberToList,
  removeMemberFromList,
  getJoinListMemberByAuctionID,
  sortAuctionByTime,
  filterAuction,
};
