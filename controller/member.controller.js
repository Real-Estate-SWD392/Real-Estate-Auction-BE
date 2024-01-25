const { memberModel } = require("../models/member.model");
const EXCEPTIONS = require("../exceptions/Exceptions");
const HTTP = require("../HTTP/HttpStatusCode");

const getMemberByID = async (req, res) => {
  try {
    const id = req.params.id;

    const member = await memberModel.findOne({ _id: id });

    if (member) {
      res.status(HTTP.OK).json({
        success: true,
        response: member,
      });
    } else {
      res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: EXCEPTIONS.FAIL_TO_GET_ITEM,
      });
    }
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = { getMemberByID };
