const express = require("express");
const { getProvinces, getCitiesByProvince } = require("./location.Controller");
const router = express.Router();
const passport = require("passport");

router.get(
  "/location/provinces",
  passport.authenticate("accessToken", { session: false }),
  getProvinces
);
router.get(
  "/location/cities/:provinceID",
  passport.authenticate("accessToken", { session: false }),
  getCitiesByProvince
);

module.exports = router;
