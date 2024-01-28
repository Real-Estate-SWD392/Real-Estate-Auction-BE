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

    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

const generateResetToken = async (account) => {
  try {
    const payload = { _id: account._id, email: account.email };

    const resetToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return Promise.resolve(resetToken);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = { generateTokens, generateResetToken };
