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
  adminGetAllComments,
  setCommentStatus,
  removeComment,
  removeReply,
  addReply,
  setReplyCommentStatus,
} = require("./comment.controller");

//* Validator Schema
const {
  createCommentSchema,
  setCommentStatusSchema,
  addReplyCommentSchema,
} = require("./comment.validator");

//* Routes

router
  .route("/")
  .get(getAllComments)
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(createCommentSchema),
    createComment
  );

router
  .route("/all")
  .get(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    adminGetAllComments
  );

router
  .route("/:commentID")
  .patch(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    bodyValidator(setCommentStatusSchema),
    setCommentStatus
  )
  .delete(
    passport.authenticate("accessToken", { session: false }),
    rolesGuard(["OWNER", "ADMIN"]),
    removeComment
  );

router
  .route("/:commentID/reply")
  .post(
    passport.authenticate("accessToken", { session: false }),
    bodyValidator(addReplyCommentSchema),
    addReply
  );

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
    bodyValidator(setCommentStatusSchema),
    setReplyCommentStatus
  );

module.exports = router;
