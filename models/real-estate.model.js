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
      default: "Available",
      enum: {
        values: ["Sold", "Available", "In Auction", "Pending", "Rejected"],
      },
    },
    pdf: [{ type: String }],
    image: [{ type: String }],
    ownerID: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const realEstateEnums = {
  type: realEstateSchema.path("type").enumValues,
  status: realEstateSchema.path("status").enumValues,
};

const realEstateModel = mongoose.model("Real-Estate", realEstateSchema);

module.exports = { realEstateModel, realEstateEnums };
