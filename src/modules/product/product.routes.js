const express = require("express");
const router = express.Router();

//* MiddleWares
const rolesGuard = require("../../middlewares/rolesGuard");
const { bodyValidator } = require("../../middlewares/validator");

//* Validator Schema

//* Uploader
const { multerStorage } = require("../../utils/multer");
const upload = multerStorage("public/images/products", 5, [
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
]);

//* Controller
const { create } = require("./product.controller");

//* Routes

router
  .route("/")
  .post(rolesGuard(["OWNER", "ADMIN"]), upload.array("images", 10), create);

module.exports = router;
