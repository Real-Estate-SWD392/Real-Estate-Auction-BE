const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  realEstateID: { type: mongoose.Types.ObjectId },
  memberID: { type: mongoose.Types.ObjectId },
  street: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
});

const addressModel = mongoose.model("Address", addressSchema);

module.exports = addressModel;
