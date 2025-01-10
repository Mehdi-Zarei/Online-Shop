const express = require("express");
const passport = require("passport");
const { restrictUser, unRestrictUser } = require("./users.controller");
const router = express.Router();

router
  .route("/users/restrictUser/:userID")
  .put(passport.authenticate("accessToken", { session: false }), restrictUser);

router
  .route("/users/unRestrictUser/:userID")
  .put(
    passport.authenticate("accessToken", { session: false }),
    unRestrictUser
  );

module.exports = router;
