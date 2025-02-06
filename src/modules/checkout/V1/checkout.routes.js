const express = require("express");
const router = express.Router();

//* Middlewares
const { bodyValidator } = require("../../../middlewares/validator");
const passport = require("passport");

//* Validator Schema
const { createCheckoutSchema } = require("./checkout.validator");

//* Controller
const { createCheckout, verifyCheckout } = require("./checkout.controller");

//* Routes

router
  .route("/")
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(createCheckoutSchema),
    createCheckout
  );
router.route("/verify").get(verifyCheckout);

module.exports = router;
