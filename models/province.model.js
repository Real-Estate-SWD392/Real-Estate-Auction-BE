const mongoose = require("mongoose");

const provinceSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  district: {
    type: [{ type: String }],
    default: [],
  },
});

const provinceModel = mongoose.model("Province", provinceSchema);

module.exports = provinceModel;
