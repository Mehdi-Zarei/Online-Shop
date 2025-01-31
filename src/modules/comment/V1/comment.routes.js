const express = require("express");
const router = express.Router();

//* Middlewares
const rolesGuard = require("../../../middlewares/rolesGuard");
const { bodyValidator } = require("../../../middlewares/validator");
const passport = require("passport");

//* Controller
const {
  getAllComments,
  createComment,
  editComment,
  removeComment,
  removeReplay,
  addReplay,
  editReplay,
} = require("./comment.controller");

//* Validator Schema
// todo : validations
//* Routes

router
  .route("/")
  .get(getAllComments)
  .post(
    passport.authenticate("accessToken", { session: false }),
    createComment
  );

router
  .route("/:commentID")
  .patch(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"], editComment)
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    removeComment
  );

router
  .route("/:commentID/replay")
  .post(passport.authenticate("accessToken", { session: false }), addReplay)
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    removeReplay
  )
  .patch(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    editReplay
  );

module.exports = router;
