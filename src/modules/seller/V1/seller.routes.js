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
const {
  createSellerSchema,
  updateInfoSellerSchema,
} = require("./seller.validator");

//* Routes
router
  .route("/register")
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(createSellerSchema),
    register
  );

router
  .route("/activate/:storeID")
  .post(rolesGuard(["OWNER", "ADMIN"]), activateStore);

router
  .route("/deactivate/:storeID")
  .post(rolesGuard(["OWNER", "ADMIN"]), deactivateStore);

router
  .route("/updateInfo/:storeID")
  .patch(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(updateInfoSellerSchema),
    updateSellerInfo
  );

router
  .route("/:storeID")
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    removeSellerStore
  )
  .get(passport.authenticate("accessToken", { session: false }), getInfo);

module.exports = router;
