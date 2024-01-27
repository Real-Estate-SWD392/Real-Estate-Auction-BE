const verifyRefreshToken = require("../utils/verifyRefreshToken");
const jwt = require("jsonwebtoken");
const HTTP = require("../HTTP/HttpStatusCode");

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res
      .status(HTTP.UNAUTHORIZED)
      .json("Access Denied. No refresh token provided.");
  }

  verifyRefreshToken(refreshToken)
    .then(({ decoded }) => {
      const payload = { _id: decoded._id, email: decoded.email };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "17m",
      });

      res.header("authorization", accessToken).status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports = refreshToken;
