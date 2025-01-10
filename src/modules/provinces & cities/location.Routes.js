const express = require("express");
const { getProvinces, getCitiesByProvince } = require("./location.Controller");
const router = express.Router();

router.get("/location/provinces", getProvinces);
router.get("/location/cities/:provinceID", getCitiesByProvince);

module.exports = router;
