const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Controller
const { register } = require("./seller.controller");

//* Middleware
const { bodyValidator } = require("../../../middlewares/validator");

//* Validator Schema
const { createSellerSchema } = require("./seller.validator");

//* Routes
router
  .route("/seller/register")
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(createSellerSchema),
    register
  );

module.exports = router;
