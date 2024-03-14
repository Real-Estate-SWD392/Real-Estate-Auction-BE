const { default: mongoose } = require("mongoose");
const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const userModel = require("../models/user.model");
const { auctionModel } = require("../models/auction.model");

const getMemberByID = async (req, res) => {
  try {
    const _id = req.params.id;

    const member = await userModel.findOne({ _id }).populate({
      path: "favoriteList",
      populate: { path: "realEstateID" },
    });

    if (member) {
      res.status(HTTP.OK).json({
        success: true,
        response: member,
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_GET_ITEM,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const editProfileMemberByID = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      firstName,
      lastName,
      phoneNumber,
      street,
      ward,
      district,
      city,
      image,
    } = req.body;

    const updateMember = await userModel.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber, street, ward, district, city, image },
      {
        new: true,
      }
    );

    if (updateMember) {
      res.status(HTTP.OK).json({
        success: true,
        response: updateMember,
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getBidListByMember = async (req, res) => {
  try {
    const _id = req.params.id;

    const bidList = await auctionModel({ joinList: _id });

    if (bidList.joinList.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: bidList,
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "You not join any auction!!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const addAuctionToFavoriteList = async (req, res) => {
  try {
    const userId = req.params.id;

    const { _id } = req.body;

    const checkAuctionExist = await userModel.findOne({
      _id: userId,
      favoriteList: { $in: [_id] },
    });

    if (checkAuctionExist) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "This auction is already on favourite list" });
    }

    const addFavoriteAuction = await userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $push: {
            favoriteList: _id,
          },
        },
        { new: true } // Add select option to specify the field to populate
      )
      .populate("favoriteList");

    if (addFavoriteAuction) {
      res.status(HTTP.OK).json({
        success: true,
        response: addFavoriteAuction,
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_ADD_FAVORITE,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const removeAuctionFromFavoriteList = async (req, res) => {
  try {
    const userID = req.body.id;

    const auctionID = req.params.auctionID;

    const checkAuctionExist = await userModel.find({
      favoriteList: { $in: [auctionID] },
    });

    if (checkAuctionExist.length <= 0) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "This auction is not on favourite list" });
    }

    const removeFavoriteAuction = await userModel
      .findOneAndUpdate(
        { _id: userID },
        {
          $pull: {
            favoriteList: auctionID,
          },
        },
        { new: true } // Add select option to specify the field to populate
      )
      .populate("favoriteList");

    if (removeFavoriteAuction) {
      res.status(HTTP.OK).json({
        success: true,
        response: removeFavoriteAuction,
        message: "Remove Auction From Favorite List Successfully!",
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_REMOVE_FAVORITE,
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const ratingOwnerAuction = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, rating } = req.body;
    console.log("s", req.body);
    // Tìm user theo id
    const user = await userModel.findOne({ _id: id });
    // Kiểm tra xem userId đã tồn tại trong listRatingByUser hay chưa
    const hasRated = user.listRatingByUser.some(
      (rating) => rating.userId === userId
    );
    if (hasRated) {
      res.status(HTTP.BAD_REQUEST).json({
        success: true,
        message: "You have already rated!!",
      });
    } else {
      const ratingOwnerAuction = await userModel.findOneAndUpdate(
        { _id: id },
        { $push: { listRatingByUser: { userId: userId, rating: rating } } },
        { new: true }
      );
      if (ratingOwnerAuction) {
        res.status(HTTP.OK).json({
          success: true,
          message: "Rating successfully!!",
          response: ratingOwnerAuction,
        });
      } else {
        res.status(HTTP.BAD_REQUEST).json({
          success: false,
          message: EXCEPTIONS.FAIL_TO_RATING_OWNER_AUCTION,
        });
      }
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  getMemberByID,
  editProfileMemberByID,
  addAuctionToFavoriteList,
  ratingOwnerAuction,
  getBidListByMember,
  removeAuctionFromFavoriteList,
};
