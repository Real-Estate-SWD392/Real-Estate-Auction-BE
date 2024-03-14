const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    auctionId: { type: mongoose.Types.ObjectId, ref: "Auction" },
    ownerId: { type: mongoose.Types.ObjectId, ref: "User" },
    reportDetail: [
      {
        reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reportReason: {
          type: String,
          enum: [
            "Fraudulent Activity",
            "Inappropriate Content",
            "Scam/Missing Information",
            "Price Manipulation",
            "Counterfeit Items",
            "Unfair Bidding Practices",
          ],
          required: true,
        },
        reportDescription: { type: String, minLength: 5, required: true },
      },
    ],
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
  },
  { timestamps: true }
);

const reportModel = mongoose.model("report", reportSchema);

module.exports = { reportModel };
