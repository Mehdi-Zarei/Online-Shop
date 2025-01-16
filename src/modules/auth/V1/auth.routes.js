const express = require("express");
const router = express.Router();
const passport = require("passport");

//* Controller

const {
  sent,
  verify,
  getMe,
  login,
  loginWithOtp,
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

router.route("/sent").post(bodyValidator(phoneNumberSchema), sent);

router.route("/verify").post(bodyValidator(registerSchema), verify);

router
  .route("/login")
  .post(
    bodyValidator(loginSchema),
    passport.authenticate("local", { session: false }),
    login
  );

router.route("/login-otp").post(loginWithOtp);

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), login);

router
  .route("/me")
  .get(passport.authenticate("accessToken", { session: false }), getMe);

router
  .route("/refresh")
  .get(passport.authenticate("refreshToken", { session: false }), refreshToken);

router
  .route("/forget-password")
  .post(bodyValidator(forgetPasswordSchema), forgetPassword);

router
  .route("/reset-password/:token")
  .post(bodyValidator(resetPasswordSchema), resetPassword);

router
  .route("/logout")
  .post(passport.authenticate("accessToken", { session: false }), logOut);

module.exports = router;
