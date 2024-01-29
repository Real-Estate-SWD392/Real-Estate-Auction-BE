const provinceModel = require("../models/province.model");
const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTIONS = require("../exceptions/Exceptions");

const getProvinceByCityName = async (req, res) => {
  try {
    const city = req.params.city;
    const province = await provinceModel.find({ name: city });

    if (province) {
      res.status(HTTP.OK).json({
        success: true,
        response: province,
      });
    } else {
      res.status(HTTP.NOT_FOUND),
        json({
          success: false,
          message: "Not found city!",
        });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      error: EXCEPTIONS.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = { getProvinceByCityName };
