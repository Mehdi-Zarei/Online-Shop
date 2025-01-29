const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Middleware
const rolesGuard = require("../../../middlewares/rolesGuard");

//* Routes

//todo : Owner can see all sellers requests

router
  .route("/")
  .get(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["SELLER"]),
    getAllSellerRequests
  )
  .post(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["SELLER"]),
    createSellerRequests
  );

router
  .route("/:id")
  .get(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN", "SELLER"]),
    getOneSellerRequests
  )
  .patch(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    updateSellerRequestsStatus
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN", "SELLER"]),
    deleteSellerRequests
  );

module.exports = router;
