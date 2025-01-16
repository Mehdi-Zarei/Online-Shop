const express = require("express");
const { getProvinces, getCitiesByProvince } = require("./location.Controller");
const router = express.Router();

router.get("/provinces", getProvinces);
router.get("/cities/:provinceID", getCitiesByProvince);

module.exports = router;
