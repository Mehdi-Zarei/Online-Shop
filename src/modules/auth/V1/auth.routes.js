const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Controller

const {
  sent,
  verify,
  getMe,
  login,
  refreshToken,
  forgetPassword,
  resetPassword,
  logOut,
} = require("./auth.controller");

//* Middlewares

const { bodyValidator } = require("../../../middlewares/validator");

//* Validator Schema

const {
  phoneNumberSchema,
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} = require("./auth.validators");

//* Routes

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

router
  .route("/auth/forget-password")
  .post(bodyValidator(forgetPasswordSchema), forgetPassword);

router
  .route("/auth/reset-password/:token")
  .post(bodyValidator(resetPasswordSchema), resetPassword);

router
  .route("/auth/logout")
  .post(passport.authenticate("accessToken", { session: false }), logOut);

module.exports = router;
