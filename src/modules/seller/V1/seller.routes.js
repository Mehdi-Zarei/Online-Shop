const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Controller
const { register, activateStore } = require("./seller.controller");

//* Middleware
const { bodyValidator } = require("../../../middlewares/validator");
const rolesGuard = require("../../../middlewares/rolesGuard");

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

router
  .route("/seller/activate/:storeID")
  .post(rolesGuard(["OWNER", "ADMIN"]), activateStore);

module.exports = router;
