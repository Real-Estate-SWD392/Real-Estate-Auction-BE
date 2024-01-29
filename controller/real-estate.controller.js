const { json } = require("express");
const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTIONS = require("../exceptions/Exceptions");
const {
  realEstateModel,
  realEstateEnums,
} = require("../models/real-estate.model");
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const _ = require("lodash");
const addressModel = require("../models/address.model");

const getAllRealEstate = async (req, res) => {
  try {
    const result = await realEstateModel.find({});
    if (result.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: result,
      });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, error: EXCEPTIONS.FAIL_TO_GET_ITEM });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getRealEstateByOwner = async (req, res) => {
  try {
    const ownerID = req.params.ownerID;

    const result = await realEstateModel.find({ ownerID });

    if (result.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: result,
      });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, error: EXCEPTIONS.FAIL_TO_GET_ITEM });
    }
  } catch (error) {
    console.log("error");
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getRealEstateByID = async (req, res) => {
  try {
    const _id = req.params.id;

    const result = await realEstateModel.findOne({ _id });
    if (result) {
      res.status(HTTP.OK).json({
        success: true,
        response: result,
      });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, error: EXCEPTIONS.FAIL_TO_GET_ITEM });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getRealEstateByStatus = async (req, res) => {
  try {
    const status = req.params.status;

    const result = await realEstateModel.find({ status: status });

    if (result.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: result,
      });
    } else {
      res
        .status(HTTP.NOT_FOUND)
        .json({ success: false, error: EXCEPTIONS.FAIL_TO_GET_ITEM });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getRealEstateByType = async (req, res) => {
  try {
    const type = req.params.type;

    const result = await realEstateModel.find({ type });

    if (result.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: result,
      });
    } else {
      res
        .status(HTTP.NOT_FOUND)
        .json({ success: false, error: EXCEPTIONS.FAIL_TO_GET_ITEM });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const createNewRealEstate = async (req, res) => {
  try {
    const {
      bedRoom,
      bathRoom,
      size,
      status,
      pdf,
      image,
      ownerID,
      street,
      district,
      city,
    } = req.body;

    console.log(city);

    const newRealEstate = await realEstateModel({
      bedRoom,
      bathRoom,
      size,
      status,
      pdf,
      image,
      ownerID,
    });

    const checkRealEstate = await newRealEstate.save();

    const auctionAddress = new addressModel({
      realEstateID: checkRealEstate._id,
      street,
      district,
      city: undefined,
    });

    const checkAdress = await auctionAddress.save();

    if (checkRealEstate && checkAdress) {
      res.status(HTTP.INSERT_OK).json({
        success: true,
        response: newRealEstate,
      });
    } else {
      res.status(HTTP.BAD_REQUEST),
        json({
          success: false,
          response: EXCEPTIONS.FAIL_TO_CREATE_ITEM,
        });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateRealEstate = async (req, res) => {
  try {
    const { _id, bedRoom, bathRoom, size, status, pdf, image, ownerID, type } =
      req.body;

    const isStatusValid = realEstateEnums.status.find(
      (check) => check === status
    );

    const isTypeValid = realEstateEnums.type.find((check) => check === type);

    const newValues = {
      bedRoom,
      bathRoom,
      size,
      status,
      pdf,
      image,
      ownerID: mongoose.Types.ObjectId.createFromHexString(ownerID),
      type,
    };

    const oldValues = await realEstateModel.findOne(
      { _id },
      { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );

    // const valuesChanged = _.isEqual(oldValues, newValues);

    const valuesChanged = Object.keys(newValues).some((key) => {
      const oldValueJSON = JSON.stringify(oldValues[key]);
      const newValueJSON = JSON.stringify(newValues[key]);

      return oldValueJSON !== newValueJSON;
    });

    if (valuesChanged && isTypeValid && isStatusValid) {
      const checkUpdate = await realEstateModel.updateOne({ _id }, newValues);

      if (checkUpdate.modifiedCount > 0) {
        res.status(HTTP.OK).json({
          success: true,
          response: checkUpdate,
        });
      } else {
        res.status(HTTP.BAD_REQUEST).json({
          success: false,
          response: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
        });
      }
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: "New values is the same with old values",
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const uploadPDF = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/PDFs");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

  const uploadMultiple = multer({ storage: storage }).array("pdf", 12);

  uploadMultiple(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const files = req.files;
    res.status(200).json(files);
  });
};

const uploadImages = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

  const uploadMultiple = multer({ storage: storage }).array("images", 12);

  uploadMultiple(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const files = req.files;
    res.status(200).json(files);
  });
};

module.exports = {
  getAllRealEstate,
  getRealEstateByID,
  getRealEstateByStatus,
  getRealEstateByOwner,
  getRealEstateByType,
  createNewRealEstate,
  updateRealEstate,
  uploadPDF,
  uploadImages,
};
