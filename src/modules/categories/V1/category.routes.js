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
  createMainCategory,
  getAllMainCategories,
  updateMainCategory,
  removeMainCategory,
  createSubCategory,
  getAllSubCategories,
  updateSubCategory,
  removeSubCategory,
  createChildSubCategory,
  getAllChildSubCategories,
  updateChildSubCategory,
  removeChildSubCategory,
} = require("./category.controller");

//* Main Categories Routes

router
  .route("/")
  .post(
    upload.single("icon"),
    rolesGuard(["OWNER", "ADMIN"]),
    createMainCategory
  )
  .get(getAllMainCategories);

router
  .route("/:categoryID")
  .put(
    upload.single("icon"),
    rolesGuard(["OWNER", "ADMIN"]),
    updateMainCategory
  )
  .delete(rolesGuard(["OWNER", "ADMIN"]), removeMainCategory);

//* Sub Categories Routes

router
  .route("/sub")
  .post(rolesGuard(["OWNER", "ADMIN"]), createSubCategory)
  .get(getAllSubCategories);
router
  .route("/sub/:subCategoryID")
  .put(rolesGuard(["OWNER", "ADMIN"]), updateSubCategory)
  .delete(rolesGuard(["OWNER", "ADMIN"]), removeSubCategory);

//* Child Sub Categories Routes

router
  .route("/sub/child")
  .post(rolesGuard(["OWNER", "ADMIN"]), createChildSubCategory)
  .get(getAllChildSubCategories);

router
  .route("/sub/child/:childSubCategoryID")
  .put(rolesGuard(["OWNER", "ADMIN"]), updateChildSubCategory)
  .delete(rolesGuard(["OWNER", "ADMIN"]), removeChildSubCategory);

module.exports = router;
