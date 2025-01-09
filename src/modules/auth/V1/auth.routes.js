const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  sent,
  verify,
  getMe,
  login,
  refreshToken,
} = require("./auth.controller");

const { bodyValidator } = require("../../../middlewares/validator");

const {
  phoneNumberSchema,
  registerSchema,
  loginSchema,
} = require("./auth.validators");

router.route("/auth/sent").post(bodyValidator(phoneNumberSchema), sent);

router.route("/auth/verify").post(bodyValidator(registerSchema), verify);

router
  .route("/auth/login")
  .post(
    bodyValidator(loginSchema),
    passport.authenticate("local", { session: false }),
    login
  );

router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/auth/google/callback")
  .get(passport.authenticate("google", { session: false }), login);

router
  .route("/auth/me")
  .get(passport.authenticate("accessToken", { session: false }), getMe);

router
  .route("/auth/refresh")
  .get(passport.authenticate("refreshToken", { session: false }), refreshToken);

module.exports = router;
