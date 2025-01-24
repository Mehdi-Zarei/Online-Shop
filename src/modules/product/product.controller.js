const { isValidObjectId } = require("mongoose");
const { nanoid } = require("nanoid");
const slugify = require("slugify");
const fs = require("fs");

//* Models
const productModel = require("../../../models/product");
const childSubCategoryModel = require("../../../models/child-subCategory");
const sellerModel = require("../../../models/seller");
const usersModel = require("../../../models/users");

//* Validator Schema
const { createProductSchema } = require("./product.validator");

//* Helper Functions
const {
  errorResponse,
  successResponse,
} = require("../../helpers/responseMessage");

exports.create = async (req, res, next) => {
  try {
    let {
      name,
      description,
      childSubCategory,
      filterValues,
      customFilters,
      slug,
      sellers,
    } = req.body;

    if (filterValues) filterValues = JSON.parse(filterValues);
    if (customFilters) customFilters = JSON.parse(customFilters);
    if (sellers) sellers = JSON.parse(sellers);

    const mainSeller = await sellerModel.findById(sellers[0].sellerID);

    if (!mainSeller) {
      return errorResponse(res, 404, "Seller not found !!");
    }

    if (mainSeller?.isActive === false) {
      return errorResponse(res, 403, "This Seller Shop Not Active !!");
    }

    let images = req.files.map(
      (file) => `public/images/products/${file.filename}`
    );

    await createProductSchema.validate(req.body, {
      abortEarly: false,
    });

    if (!isValidObjectId(childSubCategory)) {
      return errorResponse(res, 409, "Child Sub Category ID Not Valid !!");
    }

    const isCategoryExist = !!(await childSubCategoryModel.findById(
      childSubCategory
    ));

    if (!isCategoryExist) {
      return errorResponse(res, 404, "Category Not Exist !!");
    }

    slug = slugify(slug, { lower: true, strict: true });

    const isTheSlugRepetitive = !!(await productModel.findOne({ slug }));

    if (isTheSlugRepetitive) {
      slug = slug + "-" + Date.now().toString().slice(-4);
    }

    let shortIdentifier = nanoid(6);

    const isShortIdentifierRepetitive = !!(await productModel.findOne({
      shortIdentifier,
    }));

    if (isShortIdentifierRepetitive) {
      shortIdentifier = shortIdentifier + "-" + Date.now().toString().slice(-2);
    }

    if (req.files.length === 0) {
      return errorResponse(
        res,
        409,
        "Submitting a photo is required to create a product."
      );
    }

    const newProducts = await productModel.create({
      name,
      description,
      childSubCategory,
      filterValues,
      customFilters,
      slug,
      images,
      shortIdentifier,
      sellers,
    });

    return successResponse(
      res,
      201,
      "New Product Created Successfully.",
      newProducts
    );
  } catch (error) {
    let images = req.files.map(
      (file) => `public/images/products/${file.filename}`
    );

    await Promise.all(
      images.map((filePath) => {
        fs.unlinkSync(filePath);
      })
    );

    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    //todo: with pagination
  } catch (error) {
    next(error);
  }
};

exports.getMainProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Product ID Not Valid !!");
    }

    const product = await productModel
      .findById(id)
      .populate("childSubCategory", "title description")
      .populate("sellers.sellerID")
      .lean();

    if (!product) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    return successResponse(res, 200, product);
  } catch (error) {
    next(error);
  }
};

exports.updateProductInfo = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
