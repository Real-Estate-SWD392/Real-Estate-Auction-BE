const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const { auctionModel } = require("../models/auction.model");
const bidModel = require("../models/bid.model");
const { realEstateModel } = require("../models/real-estate.model");

const getBidByAuction = async (req, res) => {
  try {
    const auctionID = req.params.auctionID;

    const bid = await bidModel
      .find({ auctionID })
      .sort({ createdAt: -1 })
      .populate("userID");

    if (bid) {
      res.status(HTTP.OK).json({ success: true, response: bid });
    } else {
      res
        .status(HTTP.NOT_FOUND)
        .json({ success: false, message: EXCEPTIONS.FAIL_TO_GET_ITEM });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: "get data fail" });
  }
};

const getUserBid = async (req, res) => {
  try {
    const userID = req.params.id;

    const bid = await bidModel.find({ userID: userID }).populate({
      path: "auctionID",
      populate: [
        {
          path: "realEstateID",
          populate: [
            {
              path: "ownerID",
            },
          ],
        },
      ],
    });

    res.status(HTTP.OK).json({ success: true, response: bid });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ message: "get user bid fail" });
  }
};

const updateNewBid = async (req, res) => {
  try {
    const { auctionID, userID, price } = req.body;

    const auction = await auctionModel.findOne(
      { _id: auctionID },
      { currentPrice: 1 }
    );

    if (auction.currentPrice >= price) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "Your bid must more than current price!!" });
    }

    auction.currentPrice = price;
    const updateAuction = await auction.save();

    const bid = await bidModel
      .findOneAndUpdate({ auctionID, userID }, { price }, { new: true })
      .populate({
        path: "auctionID",
        populate: [
          {
            path: "realEstateID",

            populate: [
              {
                path: "ownerID",
              },
            ],
          },
        ],
      });

    if (bid && updateAuction) {
      res.status(HTTP.INSERT_OK).json({ success: true, response: bid });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, message: "Update Bid Fail!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ message: "Update Bid Fail!" });
  }
};

const getWinBid = async (req, res) => {
  try {
    const id = req.params.id;

    const winList = await auctionModel
      .find({ winner: id })
      .populate("realEstateID");

    return res.status(HTTP.OK).json({
      success: true,
      response: winList,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: "Get List Fail Failed",
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
    });
  }
};

const createBid = async (req, res) => {
  try {
    const { auctionID, userID, price } = req.body;

    const auction = await auctionModel.findOne({ _id: auctionID });

    if (auction.status === "End")
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, message: "Auction Is Ended" });

    const oldNumberOfBidder = auction.numberOfBidder;

    if (auction.currentPrice >= price) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Your bid must more than current price!!",
      });
    }

    const bid = new bidModel({
      auctionID,
      userID,
      price,
    });

    auction.currentPrice = price;
    auction.numberOfBidder = oldNumberOfBidder + 1;

    const updateAuction = await auction.save();

    const createBid = await bid.save();

    await createBid.populate([
      {
        path: "auctionID",
        populate: [
          {
            path: "realEstateID",

            populate: [{ path: "ownerID" }],
          },
        ],
      },
      { path: "userID" },
    ]);

    if (createBid && updateAuction) {
      res.status(HTTP.INSERT_OK).json({
        success: true,
        response: createBid,
        message: "Place Bid Successfully!!",
      });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, message: "Create Bid Fail!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ message: "Create Bid Fail!" });
  }
};

module.exports = {
  createBid,
  getBidByAuction,
  getUserBid,
  updateNewBid,
  getWinBid,
};
