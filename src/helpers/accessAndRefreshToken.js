const jwt = require("jsonwebtoken");
const configs = require("../../configs");

const generateAccessToken = function (_id, roles) {
  return jwt.sign(
    { id: _id, roles: roles },
    configs.auth.jwtSecretAccessToken,
    {
      expiresIn: configs.auth.accessTokenExpireInMinutes,
    }
  );
};

const generateRefreshToken = function (_id) {
  return jwt.sign({ id: _id }, configs.auth.jwtSecretRefreshToken, {
    expiresIn: configs.auth.refreshTokenExpireInDays,
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
