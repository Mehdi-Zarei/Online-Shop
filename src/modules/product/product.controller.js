const { isValidObjectId } = require("mongoose");
const { nanoid } = require("nanoid");
const slugify = require("slugify");
const fs = require("fs");

const productModel = require("../../../models/product");
const childSubCategoryModel = require("../../../models/child-subCategory");
const { createProductSchema } = require("./product.validator");

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
      price,
      slug,
      stock,
    } = req.body;

    if (filterValues) filterValues = JSON.parse(filterValues);
    if (customFilters) customFilters = JSON.parse(customFilters);

    let images = req.files.map(
      (file) => `public/images/products/${file.filename}`
    );

    try {
      await createProductSchema.validate(req.body, { abortEarly: false });
    } catch (error) {
      await Promise.all(
        images.map((filePath) => {
          fs.unlinkSync(filePath);
        })
      );
      next(error);
    }

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
      price,
      stock,
    });

    return successResponse(
      res,
      201,
      "New Product Created Successfully.",
      newProducts
    );
  } catch (error) {
    next(error);
  }
};
