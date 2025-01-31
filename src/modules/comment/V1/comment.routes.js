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
  setCommentStatus,
  removeComment,
  removeReply,
  addReply,
  setReplyCommentStatus,
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
    rolesGuard(["OWNER", "ADMIN"]),
    setCommentStatus
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    removeComment
  );

router
  .route("/:commentID/reply")
  .post(passport.authenticate("accessToken", { session: false }), addReply);

router
  .route("/:commentID/reply/:replyID")
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    removeReply
  )
  .patch(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    setReplyCommentStatus
  );

module.exports = router;
