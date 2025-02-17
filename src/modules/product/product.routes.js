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
const {
  create,
  getAllProducts,
  getAllProductsWithFilters,
  getMainProduct,
  updateProductInfo,
  deleteProduct,
} = require("./product.controller");

//* Routes

router
  .route("/")
  .post(rolesGuard(["OWNER", "ADMIN"]), upload.array("images", 10), create)
  .get(getAllProducts);

router.route("/filters").get(getAllProductsWithFilters);

router
  .route("/:id")
  .get(getMainProduct)
  .put(
    rolesGuard(["OWNER", "ADMIN"]),
    upload.array("images", 10),
    updateProductInfo
  )
  .delete(rolesGuard(["OWNER", "ADMIN"]), deleteProduct);

module.exports = router;
