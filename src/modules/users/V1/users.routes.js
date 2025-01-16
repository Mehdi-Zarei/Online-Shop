const express = require("express");
const passport = require("passport");
const router = express.Router();

//* Controller
const {
  restrictUser,
  unRestrictUser,
  addAddress,
  removeAddress,
  getAllAddresses,
  removeAllAddresses,
  getAddresses,
  updateAddress,
  getAll,
  changeRoles,
} = require("./users.controller");

//* Middlewares

const { bodyValidator } = require("../../../middlewares/validator");
const rolesGuard = require("../../../middlewares/rolesGuard");

//* Validation Schema

const { addressSchema, updateAddressSchema } = require("./validation");

//* Routes

router
  .route("/restrictUser/:userID")
  .put(passport.authenticate("accessToken", { session: false }), restrictUser);

router
  .route("/unRestrictUser/:userID")
  .put(
    passport.authenticate("accessToken", { session: false }),
    unRestrictUser
  );

router
  .route("/me/addresses")
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(addressSchema),
    addAddress
  );

router
  .route("/me/address/:addressID/remove")
  .delete(
    passport.authenticate("accessToken", { session: false }),
    removeAddress
  );

router
  .route("/me/addresses")
  .get(
    passport.authenticate("accessToken", { session: false }),
    getAllAddresses
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    removeAllAddresses
  );

router
  .route("/me/address/:addressID")
  .get(passport.authenticate("accessToken", { session: false }), getAddresses)
  .patch(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(updateAddressSchema),
    updateAddress
  );

router
  .route("/")
  .get(passport.authenticate("accessToken", { session: false }), getAll);

router.route("/:userID/change-roles").patch(rolesGuard(["OWNER"]), changeRoles);

module.exports = router;
