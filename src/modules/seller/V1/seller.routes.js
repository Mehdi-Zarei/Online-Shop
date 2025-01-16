const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Controller
const {
  register,
  activateStore,
  deactivateStore,
  updateSellerInfo,
  removeSellerStore,
  getInfo,
} = require("./seller.controller");

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

router
  .route("/seller/deactivate/:storeID")
  .post(rolesGuard(["OWNER", "ADMIN"]), deactivateStore);

router
  .route("/seller/updateInfo/:storeID")
  .patch(
    passport.authenticate("accessToken", { session: false }),
    updateSellerInfo
  );

router
  .route("/seller/:storeID")
  .delete(
    passport.authenticate("accessToken", { session: false }),
    removeSellerStore
  )
  .get(passport.authenticate("accessToken", { session: false }), getInfo);

module.exports = router;
