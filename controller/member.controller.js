const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const userModel = require("../models/user.model");

const getMemberByID = async (req, res) => {
  try {
    const _id = req.params.id;

    const member = await userModel.findOne({ _id });

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
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const editProfileMemberByID = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, phoneNumber, street, ward, district, city } =
      req.body;
    const updateMember = await userModel.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber, street, ward, district, city },
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

const addAuctionToFavoriteList = async (req, res) => {
  try {
    const id = req.params.id;
    const addFavoriteAuction = await userModel.findOneAndUpdate(
      { _id: id },
      { $push: { favoriteList: req.body } },
      { new: true }
    );

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
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  getMemberByID,
  editProfileMemberByID,
  addAuctionToFavoriteList,
};
