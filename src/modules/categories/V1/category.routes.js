const express = require("express");
const router = express.Router();

//* Multer Uploader
const { multerStorage } = require("../../../utils/multer");
const upload = multerStorage("public/icon/category", 5, [
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
]);

//* Middleware
const { bodyValidator } = require("../../../middlewares/validator");
const rolesGuard = require("../../../middlewares/rolesGuard");

//* Controller
const {
  createCategory,
  updateCategory,
  removeCategory,
} = require("./category.controller");

//* Routes

router
  .route("/")
  .post(upload.single("icon"), rolesGuard(["OWNER", "ADMIN"]), createCategory);

router
  .route("/:categoryID")
  .put(upload.single("icon"), rolesGuard(["OWNER", "ADMIN"]), updateCategory)
  .delete(rolesGuard(["OWNER", "ADMIN"]), removeCategory);

module.exports = router;
