const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const { auctionModel } = require("../models/auction.model");
const bidModel = require("../models/bid.model");

const getBidByAuction = async (req, res) => {
  try {
    const auctionID = req.params.auctionID;

    const bid = await bidModel.find({ auctionID });

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

const createBid = async (req, res) => {
  try {
    const { auctionID, userID, price } = req.body;

    const auction = await auctionModel.findOne(
      { _id: auctionID },
      { currentPrice: 1 }
    );

    if (auction.currentPrice >= price)
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "Your bid must more than current price!!" });

    const bid = new bidModel({
      auctionID,
      userID,
      price,
    });

    const createBid = await bid.save();

    auction.currentPrice = price;
    const updateAuction = await auction.save();

    if (createBid && updateAuction) {
      res.status(HTTP.INSERT_OK).json({ success: true, response: createBid });
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

module.exports = { createBid, getBidByAuction };
