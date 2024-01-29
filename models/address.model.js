const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  realEstateID: { type: mongoose.Types.ObjectId },
  memberID: { type: mongoose.Types.ObjectId },
  street: { type: String, require: true },
  district: { type: String, require: true },
  city: { type: String, require: true },
});

const addressModel = mongoose.model("Address", addressSchema);

module.exports = addressModel;
