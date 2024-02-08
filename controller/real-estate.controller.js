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
const { upload, uploadFiles } = require("../config/firebase");

const getAllRealEstate = async (req, res) => {
  try {
    const realEstate = await realEstateModel.find({});

    if (realEstate.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: {
          realEstate,
        },
      });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, error: EXCEPTIONS.FAIL_TO_GET_ITEM });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getRealEstateByOwner = async (req, res) => {
  try {
    const ownerID = req.params.ownerID;

    const realEstate = await realEstateModel.find({ ownerID });

    if (realEstate.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: realEstate,
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

const getRealEstateByID = async (req, res) => {
  try {
    const _id = req.params.id;

    const realEstate = await realEstateModel.findOne({ _id });

    if (realEstate) {
      res.status(HTTP.OK).json({
        success: true,
        response: realEstate,
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

const getRealEstateByStatus = async (req, res) => {
  try {
    const status = req.params.status;

    const realEstate = await realEstateModel.find({ status });

    if (realEstate.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: realEstate,
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

    const realEstate = await realEstateModel.find({ type });

    if (realEstate.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: realEstate,
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
      pdf,
      image,
      ownerID,
      type,
      street,
      district,
      city,
    } = req.body;

    const newRealEstate = await realEstateModel({
      bedRoom,
      bathRoom,
      size,
      pdf,
      image,
      ownerID,
      type,
      street,
      district,
      city,
    });

    const checkRealEstate = await newRealEstate.save();

    if (checkRealEstate) {
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
    const _id = req.params.id;
    const {
      bedRoom,
      bathRoom,
      size,
      status,
      pdf,
      image,
      ownerID,
      type,
      street,
      district,
      city,
    } = req.body;

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
      street,
      district,
      city,
    };

    const oldValues = await realEstateModel.findOne(
      { _id },
      { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );

    if (!oldValues)
      return res
        .status(HTTP.NOT_FOUND)
        .json({ message: "Can not find real estate" });

    const valuesChanged = Object.keys(newValues).some((key) => {
      console.log(key + ": " + oldValues[key]);
      console.log(key + ": " + newValues[key]);
      const oldValueJSON = JSON.stringify(oldValues[key]);
      const newValueJSON = JSON.stringify(newValues[key]);

      return oldValueJSON !== newValueJSON;
    });

    if (!isStatusValid) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Status not valid",
      });
    }

    if (!isTypeValid) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Type not valid",
      });
    }

    if (valuesChanged) {
      const checkRealEstateUpdate = await realEstateModel.updateOne(
        { _id },
        newValues
      );

      if (checkRealEstateUpdate.modifiedCount > 0) {
        res.status(HTTP.OK).json({
          success: true,
          message: "Update Real Estate Complete",
        });
      } else {
        res.status(HTTP.BAD_REQUEST).json({
          success: false,
          response: EXCEPTIONS.FAIL_TO_UPDATE_ITEM,
          message: "Update Real Estate Fail",
        });
      }
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: "New values is the same with old values",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const removeRealEstate = async (req, res) => {
  try {
    const _id = req.params.id;

    const checkRealEstateRemove = await realEstateModel.findOneAndUpdate(
      { _id },
      { isActive: false },
      { new: true }
    );

    if (!checkRealEstateRemove)
      return res.status(HTTP.NOT_FOUND).json({
        message: "This real estate not exist!",
      });

    if (checkRealEstateRemove.isActive === false) {
      res.status(HTTP.OK).json({
        success: true,
        response: checkRealEstateRemove,
        message: "Remove Real Estate Complete!",
      });
    } else {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ success: false, message: "Remove  Real Estate Fail" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ message: "Remove Real Estate Fail" }, error);
  }
};

const uploadPDF = async (req, res) => {
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "../client/public/PDFs");
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, Date.now() + file.originalname);
  //   },
  // });

  // const uploadMultiple = multer({ storage: storage }).array("pdf", 12);

  const uploadMultiple = upload.array("pdf", 12);

  uploadMultiple(req, res, async function (err) {
    if (err) {
      return res.status(HTTP.BAD_REQUEST).json({ error: err });
    }

    const files = req.files;
    if (files.length < 1)
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "No files to upload!!" });
    const folder = "pdf";

    const fileURL = await uploadFiles(files, folder);

    if (!fileURL) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "Upload file fail!!" });
    }
    return res.status(HTTP.OK).json({ success: true, file: fileURL });
  });
};

const uploadImages = async (req, res) => {
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "../client/public/images");
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, Date.now() + file.originalname);
  //   },
  // });

  const uploadMultiple = upload.array("image", 12);

  uploadMultiple(req, res, async function (err) {
    if (err) {
      return res.status(HTTP.BAD_REQUEST).json({ error: err });
    }

    const files = req.files;
    const folder = "img";
    if (files.length < 1)
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ message: "No files to upload!!" });

    const fileURL = await uploadFiles(files, folder);

    if (!fileURL) {
      return res.status(HTTP.BAD_REQUEST).json({ message: "Upload file fail" });
    }
    return res.status(HTTP.OK).json({ success: true, file: fileURL });
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
  removeRealEstate,
  uploadPDF,
  uploadImages,
};
