const jwt = require("jsonwebtoken");
const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTION = require("../exceptions/Exceptions");

const authenticateJWT = (req, res, next) => {
  let accessToken = req.headers["authorization"]?.split("Bearer ")[1];
  const refreshToken = req.cookies["refreshToken"];

  // console.log(accessToken);
  // console.log(refreshToken);

  if (!accessToken && !refreshToken) {
    return res.status(HTTP.UNAUTHORIZED).json(EXCEPTION.ACCESS_DENIED);
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      console.log("abc");
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ message: "Refresh Token is invalid" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

      const accessToken = jwt.sign(decoded, process.env.JWT_SECRET_KEY);

      res.set("Authorization", `Bearer ${accessToken}`);

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid Token",
      });
    }
  }
};

module.exports = authenticateJWT;
