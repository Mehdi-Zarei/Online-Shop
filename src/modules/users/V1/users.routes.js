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
} = require("./users.controller");

//* Middlewares

const { bodyValidator } = require("../../../middlewares/validator");

//* Validation Schema

const { addressSchema, updateAddressSchema } = require("./validation");

//* Routes

router
  .route("/users/restrictUser/:userID")
  .put(passport.authenticate("accessToken", { session: false }), restrictUser);

router
  .route("/users/unRestrictUser/:userID")
  .put(
    passport.authenticate("accessToken", { session: false }),
    unRestrictUser
  );

router
  .route("/users/me/addresses")
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(addressSchema),
    addAddress
  );

router
  .route("/users/me/address/:addressID/remove")
  .delete(
    passport.authenticate("accessToken", { session: false }),
    removeAddress
  );

router
  .route("/users/me/addresses")
  .get(
    passport.authenticate("accessToken", { session: false }),
    getAllAddresses
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    removeAllAddresses
  );

router
  .route("/users/me/address/:addressID")
  .get(passport.authenticate("accessToken", { session: false }), getAddresses)
  .patch(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(updateAddressSchema),
    updateAddress
  );

module.exports = router;
