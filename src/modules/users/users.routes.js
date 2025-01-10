const express = require("express");
const passport = require("passport");
const {
  restrictUser,
  unRestrictUser,
  addAddress,
} = require("./users.controller");
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

router
  .route("/users/me/addresses")
  .post(passport.authenticate("accessToken", { session: false }), addAddress);

module.exports = router;
