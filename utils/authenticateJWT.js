const jwt = require("jsonwebtoken");
const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTION = require("../exceptions/Exceptions");

const authenticateJWT = (req, res, next) => {
  let accessToken = req.headers["authorization"].split("Bearer ")[1];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(HTTP.UNAUTHORIZED).send(EXCEPTION.ACCESS_DENIED);
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(HTTP.UNAUTHORIZED).send(EXCEPTION.ACCESS_DENIED);
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
      console.log(decoded);

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
