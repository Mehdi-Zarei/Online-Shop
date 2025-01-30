const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Middleware
const rolesGuard = require("../../../middlewares/rolesGuard");
const { bodyValidator } = require("../../../middlewares/validator");

//* Validator Schema
const {
  sellerRequestSchema,
  updateSellerRequestStatusSchema,
} = require("./sellerRequest.validator");

//* Controller
const {
  adminFetchAllRequests,
  getSellerRequests,
  createSellerRequest,
  getOneSellerRequest,
  updateSellerRequestStatus,
  deleteSellerRequest,
} = require("./sellerRequest.controller");

//* Routes

router
  .route("/all")
  .get(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    adminFetchAllRequests
  );

router
  .route("/")
  .get(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["SELLER"]),
    bodyValidator(sellerRequestSchema),
    getSellerRequests
  )
  .post(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["SELLER"]),
    createSellerRequest
  );

router
  .route("/:id")
  .get(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["SELLER"]),
    getOneSellerRequest
  )
  .patch(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    bodyValidator(updateSellerRequestStatusSchema),
    updateSellerRequestStatus
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["SELLER"]),
    deleteSellerRequest
  );

module.exports = router;
