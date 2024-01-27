const jwt = require("jsonwebtoken");
const accountTokenModel = require("../models/accountToken.model");

const verifyRefreshToken = (refreshToken) => {
  const privateKey = process.env.JWT_SECRET_KEY;

  return new Promise(async (resolve, reject) => {
    const accountToken = await accountTokenModel.findOne({
      token: refreshToken,
    });

    if (!accountToken)
      return reject({ error: true, message: "Invalid refresh token" });

    jwt.verify(refreshToken, privateKey, (err, decoded) => {
      if (err) return reject({ error: true, message: "Invalid refresh token" });
      resolve({
        decoded,
        error: false,
        message: "Valid refresh token",
      });
    });
  });
};

module.exports = verifyRefreshToken;
