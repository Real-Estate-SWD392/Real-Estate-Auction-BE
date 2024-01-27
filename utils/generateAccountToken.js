const accountTokenModel = require("../models/accountToken.model");
const jwt = require("jsonwebtoken");

const generateTokens = async (account) => {
  try {
    const payload = { _id: account._id, email: account.email };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "17m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    const accountToken = await accountTokenModel.findOne({
      accountID: account._id,
    });

    if (accountToken)
      await accountTokenModel.deleteOne({
        accountID: account._id,
      });

    await new accountTokenModel({
      accountID: account._id,
      token: refreshToken,
    }).save();

    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
