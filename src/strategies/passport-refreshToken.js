const jwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const configs = require("../../configs");
const userModel = require("../../models/users");
const bcrypt = require("bcryptjs");
const { getRefreshTokenFromRedis } = require("../helpers/redis");

module.exports = new jwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configs.auth.jwtSecretRefreshToken,
    passReqToCallback: true,
  },
  async (req, payload, done) => {
    try {
      const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      const user = await userModel.findOne({ _id: payload.id }, "-password");

      if (!user) {
        return done(null, false);
      }

      const hashedRefreshToken = await getRefreshTokenFromRedis(user._id);

      if (!hashedRefreshToken) {
        return done(null, false);
      }

      const compareRefreshToken = bcrypt.compareSync(
        refreshToken,
        hashedRefreshToken
      );

      if (!compareRefreshToken) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
