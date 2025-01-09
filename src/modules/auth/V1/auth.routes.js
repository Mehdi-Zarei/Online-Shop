const express = require("express");
const router = express.Router();

const { sent, verify, getMe } = require("./auth.controller");

const { bodyValidator } = require("../../../middlewares/validator");

const { phoneNumberSchema, registerSchema } = require("./auth.validators");

router.route("/auth/sent").post(bodyValidator(phoneNumberSchema), sent);
router.route("/auth/verify").post(bodyValidator(registerSchema), verify);
router.route("/auth/getMe").get(getMe);

module.exports = router;
