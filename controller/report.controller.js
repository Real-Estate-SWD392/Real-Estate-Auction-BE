const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");
const { auctionModel } = require("../models/auction.model");
const { reportModel } = require("../models/report.model");

const getAllReport = async (req, res) => {
  try {
    const reports = await reportModel
      .find()
      .populate([
        {
          path: "auctionId",
          populate: [
            {
              path: "realEstateID",

              populate: [{ path: "ownerID" }],
            },
          ],
        },
      ])
      .populate("ownerId")
      .populate("reportDetail.reporterId");
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
    const { auctionId, ownerId, reporterId, reportReason, reportDescription } =
      req.body;

    let checkIsExist = await reportModel.findOne({ auctionId });

    if (!checkIsExist) {
      const newReport = new reportModel({
        auctionId,
        ownerId,
        reportDetail: [{ reporterId, reportReason, reportDescription }],
      });

      checkIsExist = await newReport.save();
    } else {
      const reportDetailItem = {
        reporterId,
        reportReason,
        reportDescription,
      };

      checkIsExist.reportDetail.push(reportDetailItem);
      await checkIsExist.save();
    }

    res.status(HTTP.INSERT_OK).json({
      success: true,
      response: checkIsExist,
      message: "Create Report Successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

const handleReport = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    console.log(req.params);
    var handleReport = null;
    var messageReport = "";
    if (status === "Approved") {
      handleReport = await reportModel
        .findOneAndUpdate(
          { _id: id },
          { status },
          {
            new: true,
          }
        )
        .populate([
          {
            path: "auctionId",
            populate: [
              {
                path: "realEstateID",

                populate: [{ path: "ownerID" }],
              },
            ],
          },
        ])
        .populate("ownerId")
        .populate("reportDetail.reporterId");

      const closeAuction = await auctionModel.findOneAndUpdate(
        { _id: handleReport.auctionId },
        { status: "End", day: 0, hour: 0, minuute: 0, second: 0 }
      );
      messageReport = "Accept successfully!";
    } else if (status === "Rejected") {
      handleReport = await reportModel
        .findOneAndUpdate(
          { _id: id },
          { status },
          {
            new: true,
          }
        )
        .populate([
          {
            path: "auctionId",
            populate: [
              {
                path: "realEstateID",

                populate: [{ path: "ownerID" }],
              },
            ],
          },
        ])
        .populate("ownerId")
        .populate("reportDetail.reporterId");

      messageReport = "Reject successfully!";
    }

    res.status(HTTP.OK).json({
      success: true,
      response: handleReport,
      message: messageReport,
    });
  } catch (error) {
    console.log(error);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
      message: "Handle report Fail!",
    });
  }
};

module.exports = { getAllReport, createReport, handleReport };
