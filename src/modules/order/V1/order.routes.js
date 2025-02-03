const express = require("express");
const router = express.Router();

//* Middleware
const roleGuard = require("../../../../middlewares/rolesGuard");
const passport = require("passport");

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
    updateOrder
  );

module.exports = router;
