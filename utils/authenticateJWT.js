const jwt = require("jsonwebtoken");
const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTION = require("../exceptions/Exceptions");

const authenticateJWT = (req, res, next) => {
  let accessToken = req.headers["authorization"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(HTTP.UNAUTHORIZED).send(EXCEPTION.ACCESS_DENIED);
  }

  try {
    accessToken = accessToken.split("Bearer ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(HTTP.UNAUTHORIZED).send(EXCEPTION.ACCESS_DENIED);
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
      const payload = { _id: decoded._id, email: decoded.email };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "17m",
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", accessToken)
        .json({
          message: "Create New Access Token Complete!!",
          decoded,
        });
    } catch (error) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid Token",
      });
    }
  }
};

module.exports = authenticateJWT;
