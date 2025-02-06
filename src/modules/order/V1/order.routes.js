const express = require("express");
const router = express.Router();

//* Middleware
const roleGuard = require("../../../middlewares/rolesGuard");
const { bodyValidator } = require("../../../middlewares/validator");
const passport = require("passport");

//* Validator Schema
const { updateOrderSchema } = require("./order.validator");

//* Controllers
const { getAllOrders, updateOrder } = require("./order.controller");

//* Routes
router
  .route("/")
  .get(passport.authenticate("accessToken", { session: false }), getAllOrders);

router
  .route("/:id")
  .patch(
    passport.authenticate("accessToken", { session: false }),
    roleGuard(["OWNER", "ADMIN"]),
    bodyValidator(updateOrderSchema),
    updateOrder
  );

module.exports = router;
