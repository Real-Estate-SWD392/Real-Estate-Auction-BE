const { memberModel } = require("../models/member.model");
const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");

const getMemberByID = async (req, res) => {
  try {
    const id = req.params.id;

    const member = await memberModel.findOne({ _id: id });

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
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const editProfileMemberByID = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, phoneNumber } = req.body;
    const updateMember = await memberModel.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber },
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
    const addFavoriteAuction = await memberModel.findOneAndUpdate(
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
