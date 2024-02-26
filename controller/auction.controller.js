const { default: mongoose } = require("mongoose");
const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTIONS = require("../exceptions/Exceptions");
const { auctionModel, auctionEnums } = require("../models/auction.model");
const {
  realEstateModel,
  realEstateEnums,
} = require("../models/real-estate.model");

const getAllAuction = async (req, res) => {
  try {
    const auctions = await auctionModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("realEstateID");
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
    console.log("er: ", error);
  }
};

const getAuctionByRealEstate = async (req, res) => {
  try {
    const { id } = req.params;

    const auctions = await auctionModel
      .findOne({ realEstateID: id })
      .populate("realEstateID");
    if (auctions) {
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
    console.log("er: ", error);
  }
};

const getAuctionByID = async (req, res) => {
  try {
    const _id = req.params.id;

    const auction = await auctionModel.findOne({ _id }).populate({
      path: "realEstateID",
      populate: [
        {
          path: "ownerID",
        },
      ],
    });

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

    const auction = await auctionModel
      .find({ status: status })
      .populate("realEstateID");
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

    const auction = await auctionModel
      .find({
        name: { $regex: regex },
        status: "In Auction",
      })
      .populate("realEstateID");

    res.status(HTTP.OK).json({
      success: true,
      response: auction,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const setWinner = async (req, res) => {
  try {
    const _id = req.params.id;

    const { userID } = req.body;

    const winner = await auctionModel
      .findOneAndUpdate({ _id }, { winner: userID })
      .populate("realEstateID");

    return res.status(HTTP.OK).json({
      success: true,
      response: winner,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: "Set Winner Failed",
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
    });
  }
};

const sortAuctionByTime = async (req, res) => {
  try {
    const sortedAuctions = await auctionModel
      .find({ status: "In Auction" })
      .sort({ createdAt: -1 })
      .populate("realEstateID");
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

const sortAuctionByPopular = async (req, res) => {
  try {
    const sortedAuctions = await auctionModel
      .find({ status: "In Auction" })
      .sort({ numberOfBidder: -1 })
      .populate("realEstateID");
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
    let validField = {};

    const values = req.query;

    Object.keys(values).map((key) => {
      if (values[key] !== "") {
        if (key === "bedRoom" || key === "bathRoom") {
          validField[key] = parseInt(values[key]);
        } else {
          validField[key] = values[key];
        }
      }
    });

    const realEstates = await realEstateModel.find(validField);

    // Extract real estate IDs from the found documents
    const realEstateIDs = realEstates.map((re) => re._id);

    const filteredAuction = await auctionModel
      .find({
        realEstateID: { $in: realEstateIDs },
        status: "In Auction",
      })
      .populate("realEstateID");

    res.status(HTTP.OK).json({
      success: true,
      response: filteredAuction,
    });
  } catch (error) {
    console.log(error);
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
      day,
      hour,
      minute,
      second,
      buyNowPrice,
      realEstateID,
    } = req.body;

    console.log(req.body);

    const checkValidRealEstateID = await auctionModel.findOne({ realEstateID });

    console.log(checkValidRealEstateID);

    if (checkValidRealEstateID)
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "This real estate is already in use",
      });

    const newAuction = new auctionModel({
      name,
      startPrice,
      currentPrice: startPrice,
      priceStep,
      day,
      hour,
      minute,
      second,
      buyNowPrice,
      realEstateID,
    });

    const checkAuction = await newAuction.save();

    const updateRealState = await realEstateModel.findOneAndUpdate(
      { _id: realEstateID },
      { status: "Pending" }
    );

    if (checkAuction && updateRealState) {
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
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getJoinListMemberByAuctionID = async (req, res) => {
  try {
    const auctionID = req.params.auctionID;

    const auction = await auctionModel
      .findOne({
        _id: auctionID,
      })
      .populate("joinList");

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
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const addMemberToList = async (req, res) => {
  try {
    const { auctionID, accountID } = req.params;

    const checkIfMemberExist = await auctionModel.findOne({
      _id: auctionID,
      joinList: { $in: accountID },
    });

    if (checkIfMemberExist)
      return res
        .status(HTTP.NOT_FOUND)
        .json({ message: "Member already in list" });

    const checkUpdate = await auctionModel
      .findOneAndUpdate(
        { _id: auctionID },
        { $addToSet: { joinList: accountID } },
        { new: true }
      )
      .populate("realEstateID");

    if (!checkUpdate) {
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
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const removeMemberFromList = async (req, res) => {
  try {
    const { auctionID, accountID } = req.params;

    const auction = await auctionModel.findOne({ _id: auctionID });

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
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateAuction = async (req, res) => {
  try {
    const {
      name,
      startPrice,
      priceStep,
      day,
      hour,
      minute,
      second,
      status,
      buyNowPrice,
      realEstateID,
    } = req.body;

    const _id = req.params.id;

    const newValues = {
      name,
      startPrice,
      priceStep,
      day,
      hour,
      minute,
      second,
      status,
      buyNowPrice,
      realEstateID: mongoose.Types.ObjectId.createFromHexString(realEstateID),
    };

    const isValidStatus = auctionEnums.status.find(
      (check) => check === newValues.status
    );

    if (!isValidStatus)
      return res.status(HTTP.NOT_FOUND).json({ message: "Status not valid" });

    const oldValues = await auctionModel.findOne(
      { _id },
      { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );

    const valuesChanged = Object.keys(newValues).some((key) => {
      console.log(key + ": " + oldValues[key]);
      console.log(key + ": " + newValues[key]);
      const oldValueJSON = JSON.stringify(oldValues[key]);
      const newValueJSON = JSON.stringify(newValues[key]);

      return oldValueJSON !== newValueJSON;
    });

    if (valuesChanged) {
      const checkUpdate = await auctionModel.updateOne({ _id }, newValues);

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

    const checkRemoveAuction = await auctionModel.findOneAndUpdate(
      { _id },
      { isActive: false },
      { new: true }
    );

    if (checkRemoveAuction.isActive === false) {
      res.status(HTTP.OK).json({
        success: true,
        response: checkRemoveAuction,
        message: "Remove Auction Succesfully!!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: "Remove Auction Fail!!",
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteAuctionByStaff = async (req, res) => {
  try {
    const auctionId = req.params.id;
    await auctionModel.findOneAndDelete({
      _id: auctionId,
    });

    res.status(HTTP.OK).json({
      success: true,
      message: "Delete auction successfully!",
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
      message: "Delete Auction Fail!",
    });
  }
};

const closeAuction = async (req, res) => {
  try {
    const auctionId = req.params.id;

    const checkClose = await auctionModel
      .findOneAndUpdate(
        {
          _id: auctionId,
        },
        { status: "End" },
        {
          new: true,
        }
      )
      .populate("realEstateID");

    if (checkClose.status === "End") {
      res.status(HTTP.OK).json({
        success: true,
        message: "Close auction successfully!",
        response: checkClose,
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Close Auction Fail!",
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
      message: "Close Auction Fail!",
    });
  }
};

const handleAuctionRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { checkedStatus } = req.body;
    var filteredAuction = null;
    var filteredRealEstate = null;
    var messageAution = "";
    if (checkedStatus === "Accepted") {
      filteredAuction = await auctionModel
        .findOneAndUpdate(
          { _id: id },
          { checkedStatus, status: "In Auction" },
          {
            new: true,
          }
        )
        .populate("realEstateID");
      console.log(filteredAuction.realEstateID);

      if (filterAuction) {
        filteredRealEstate = await realEstateModel.findOneAndUpdate(
          {
            _id: filteredAuction.realEstateID,
          },
          { status: "In Auction" }
        );
      }

      messageAution = "Accept successfully!";
    } else if (checkedStatus === "Denied") {
      filteredAuction = await auctionModel
        .findOneAndUpdate(
          { _id: id },
          { checkedStatus, status: "Cancel" },
          {
            new: true,
          }
        )
        .populate("realEstateID");

      if (filterAuction) {
        filteredRealEstate = await realEstateModel.findOneAndUpdate(
          {
            _id: filteredAuction.realEstateID,
          },
          { status: "Available" }
        );
      }
      messageAution = "Denied successfully!";
    }

    res.status(HTTP.OK).json({
      success: true,
      response: filteredAuction,
      message: messageAution,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
      message: "Filter Auction Fail!",
    });
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
  deleteAuctionByStaff,
  handleAuctionRequest,
  sortAuctionByPopular,
  getAuctionByRealEstate,
  closeAuction,
  setWinner,
};
