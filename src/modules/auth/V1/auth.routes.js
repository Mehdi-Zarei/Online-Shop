const express = require("express");
const router = express.Router();

const { sent, verify, getMe } = require("./auth.controller");

router.route("/auth/sent").post(sent);
router.route("/auth/verify").post(verify);
router.route("/auth/getMe").get(getMe);

module.exports = router;
