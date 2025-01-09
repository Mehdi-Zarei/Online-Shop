const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const userModel = require("../../models/users");

module.exports = new LocalStrategy(
  {
    usernameField: "identifier",
  },
  async (identifier, password, done) => {
    try {
      const user = await userModel.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });

      if (!user) return done(null, false);

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
