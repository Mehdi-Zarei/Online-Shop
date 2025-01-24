const express = require("express");
const router = express.Router();

const passport = require("passport");

//* Controller
const { create, getAll, updateContent, remove } = require("./note.controller");

//* Routes

router
  .route("/")
  .post(passport.authenticate("accessToken", { session: false }), create)
  .get(passport.authenticate("accessToken", { session: false }), getAll);

router
  .route("/:id")
  .put(passport.authenticate("accessToken", { session: false }), updateContent)
  .delete(passport.authenticate("accessToken", { session: false }), remove);

module.exports = router;
