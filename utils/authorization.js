const HTTP = require("../HTTP/HttpStatusCode");
const EXCEPTION = require("../exceptions/Exceptions");

const authorization = (roles = []) => {
  return (req, res, next) => {
    // Check if user role is allowed to access the route
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(HTTP.FORBIDDEN).json({ message: "Unauthorized" });
    }
    next();
  };
};

module.exports = authorization;
