const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Middleware
const rolesGuard = require("../../../middlewares/rolesGuard");

//Todo: Validator

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
    updateSellerRequestStatus
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["SELLER"]),
    deleteSellerRequest
  );

module.exports = router;
