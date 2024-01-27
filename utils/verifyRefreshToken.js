const jwt = require("jsonwebtoken");

const verifyRefreshToken = (refreshToken) => {
  const privateKey = process.env.JWT_SECRET_KEY;

  return new Promise(async (resolve, reject) => {
    if (!refreshToken)
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
