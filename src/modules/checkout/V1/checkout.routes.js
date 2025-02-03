const express = require("express");
const router = express.Router();

//* Middlewares
const passport = require("passport");

//* Controller
const { createCheckout, verifyCheckout } = require("./checkout.controller");

//* Routes

router
  .route("/")
  .post(
    passport.authenticate("accessToken", { session: false }),
    createCheckout
  );
router.route("/verify").get(verifyCheckout);

module.exports = router;
