const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    auctionId: { type: mongoose.Types.ObjectId, ref: "Auction" },
    ownerId: { type: mongoose.Types.ObjectId, ref: "User" },
    reporterId: { type: mongoose.Types.ObjectId, ref: "User" },
    reportReason: { type: String, minLength: 5, required: true },
    status: {
      type: String,
      default: "Pending",
      enum: {
        values: ["Pending", "Approved", "Rejected"],
      },
    },
  },
  { timestamps: true }
);

const reportModel = mongoose.model("report", reportSchema);

module.exports = { reportModel };
