const mongoose = require("mongoose");

const realEstateSchema = new mongoose.Schema(
  {
    bedRoom: { type: Number, min: 0 },
    bathRoom: { type: Number, min: 0 },
    size: { type: Number, min: 10 },
    type: {
      type: String,
      enum: {
        values: ["Condominium", "Ground", "Penthouse", "Villa", "House"],
      },
    },
    status: {
      type: String,
      enum: {
        values: ["Sold", "Available", "In Auction", "Pending", "Rejected"],
      },
    },
    pdf: [{ type: String }],
    image: [{ type: String }],
    ownerID: { type: mongoose.Types.ObjectId, require: true },
  },
  { timestamps: true }
);

const realEstateModel = mongoose.model("Real-Estate", realEstateSchema);

module.exports = realEstateModel;
