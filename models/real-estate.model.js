const mongoose = require("mongoose");

const realEstateSchema = new mongoose.Schema(
  {
    bedRoom: { type: Number, min: 0, default: 0 },

    bathRoom: { type: Number, min: 0, default: 0 },

    size: { type: Number, min: 10, default: 0 },

    description: { type: String },

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

    ownerID: { type: mongoose.Types.ObjectId, required: true, ref: "User" },

    isActive: { type: Boolean, default: true },

    street: { type: String, minLength: 2 },

    ward: { type: String, minLength: 2 },

    district: { type: String, minLength: 2 },

    city: { type: String, minLength: 2 },
  },
  { timestamps: true }
);

const realEstateEnums = {
  type: realEstateSchema.path("type").enumValues,
  status: realEstateSchema.path("status").enumValues,
};

const realEstateModel = mongoose.model("Real-Estate", realEstateSchema);

module.exports = { realEstateModel, realEstateEnums };
