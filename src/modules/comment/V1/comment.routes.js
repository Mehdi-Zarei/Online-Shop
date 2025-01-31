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
  removeReply,
  addReply,
  editReply,
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
  .route("/:commentID/reply")
  .post(passport.authenticate("accessToken", { session: false }), addReply)
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    removeReply
  )
  .patch(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    editReply
  );

module.exports = router;
