const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const { reportModel } = require("../models/report.model");

const getAllReport = async (req, res) => {
  try {
    const reports = await reportModel
      .find()
      .populate("auctionId")
      .populate("ownerId")
      .populate("reporterId");
    if (reports.length > 0) {
      res.status(HTTP.OK).json({
        success: true,
        response: reports,
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

const createReport = async (req, res) => {
  try {
    const { auctionId, ownerId, reporterId, reportReason } = req.body;

    console.log(req.body);

    const newReport = await reportModel({
      auctionId,
      ownerId,
      reporterId,
      reportReason,
    });

    const checkNewReport = await newReport.save();

    if (checkNewReport) {
      res.status(HTTP.INSERT_OK).json({
        success: true,
        response: checkNewReport,
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

const handleReport = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    var handleReport = null;
    var messageReport = "";
    if (status === "Accepted") {
      handleReport = await reportModel.findOneAndUpdate(
        { _id: id },
        { status },
        {
          new: true,
        }
      );
      messageReport = "Accept successfully!";
    } else if (status === "Rejected") {
      handleReport = await auctionModel.findOneAndUpdate(
        { _id: id },
        { status },
        {
          new: true,
        }
      );
      messageReport = "Reject successfully!";
    }

    res.status(HTTP.OK).json({
      success: true,
      response: handleReport,
      message: messageReport,
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
      message: "Handle report Fail!",
    });
  }
};

module.exports = { getAllReport, createReport, handleReport };
