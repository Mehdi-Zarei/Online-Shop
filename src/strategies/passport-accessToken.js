const jwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const configs = require("../../configs");
const userModel = require("../../models/users");

module.exports = new jwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configs.auth.jwtSecretAccessToken,
  },
  async (payload, done) => {
    try {
      const user = await userModel.findOne({ _id: payload.id }, "-password");

      if (!user) return done(null, false);

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
