const googleStrategy = require("passport-google-oauth20").Strategy;
const configs = require("../../configs");
const userModel = require("../../models/users");

module.exports = new googleStrategy(
  {
    clientID: configs.google.clientID,
    clientSecret: configs.google.clientSecret,
    callbackURL: `${configs.domain}/api/v1/auth/google/callback`,
  },
  async (accessTone, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      const avatar = profile.photos[0].value;

      const name = `${profile.name.givenName}`;

      const isFirstUser = (await userModel.countDocuments()) === 0;

      const user = await userModel.findOne({ email }).lean();

      if (user) {
        return done(null, user);
      }

      const newUser = await userModel.create({
        phone: "null",
        name,
        email,
        roles: isFirstUser ? ["OWNER"] : ["USER"],
        avatar,
        isRestrict: false,
        provider: "google",
      });

      return done(null, newUser);
    } catch (error) {
      console.error("Error in Google OAuth Strategy:", error);
      return done(error, false);
    }
  }
);
