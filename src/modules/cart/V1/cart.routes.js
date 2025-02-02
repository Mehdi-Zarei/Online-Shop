const express = require("express");
const router = express.Router();

//* Middlewares
const passport = require("passport");
const { bodyValidator } = require("../../../middlewares/validator");

//* Validator Schema
const { cartItemSchema } = require("./cart.validator");

//* Controllers

const { getCart, addToCart, removeFromCart } = require("./cart.controller");

//* Routes

router
  .route("/")
  .get(passport.authenticate("accessToken", { session: false }), getCart);

router
  .route("/add")
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(cartItemSchema),
    addToCart
  );

router
  .route("/remove")
  .delete(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(cartItemSchema),
    removeFromCart
  );

module.exports = router;
