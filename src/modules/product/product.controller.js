const { isValidObjectId } = require("mongoose");
const { nanoid } = require("nanoid");
const slugify = require("slugify");
const fs = require("fs");

//* Models
const productModel = require("../../../models/product");
const childSubCategoryModel = require("../../../models/child-subCategory");
const sellerModel = require("../../../models/seller");
const noteModel = require("../../../models/note");

//* Validator Schema
const {
  createProductSchema,
  updateProductInfoSchema,
} = require("./product.validator");

//* Helper Functions
const {
  errorResponse,
  successResponse,
} = require("../../helpers/responseMessage");

const { createPagination } = require("../../helpers/pagination");

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

    const isProductAlreadyExist = !!(await productModel.findOne({ name }));

    if (isProductAlreadyExist) {
      return errorResponse(res, 409, "Product Already Exist !!");
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
    const { page = 1, limit = 10 } = req.query;

    const products = await productModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("childSubCategory", "title description")
      .populate("sellers.sellerID")
      .lean();

    if (!products) {
      return errorResponse(res, 404, "You Don't Have Any Product Yet !!");
    }

    const totalProductsCount = await productModel.countDocuments();

    const pagination = createPagination(
      page,
      limit,
      totalProductsCount,
      "Products"
    );

    return successResponse(res, 200, { products, pagination });
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
    const { id } = req.params;

    let {
      name,
      description,
      childSubCategory,
      filterValues,
      customFilters,
      slug,
      deleteOldImages,
    } = req.body;

    if (filterValues) filterValues = JSON.parse(filterValues);
    if (customFilters) customFilters = JSON.parse(customFilters);

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Product ID Not Valid !!");
    }

    const mainProduct = await productModel.findById(id);

    if (!mainProduct) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    if (name) mainProduct.name = name;

    if (description) mainProduct.description = description;

    if (filterValues) mainProduct.filterValues = filterValues;

    if (customFilters) mainProduct.customFilters = customFilters;

    if (childSubCategory) {
      if (!isValidObjectId(childSubCategory)) {
        return errorResponse(res, 409, "Child Sub Category ID Not Valid !!");
      }

      const isCategoryExist = !!(await childSubCategoryModel.findById(
        childSubCategory
      ));

      if (!isCategoryExist) {
        return errorResponse(res, 404, "Child Sub Category Not Exist !!");
      }

      mainProduct.childSubCategory = childSubCategory;
    }

    if (slug) {
      slug = slugify(slug, { lower: true, strict: true });

      const isTheSlugRepetitive = !!(await productModel.findOne({ slug }));

      if (isTheSlugRepetitive) {
        slug = slug + "-" + Date.now().toString().slice(-4);
      }

      mainProduct.slug = slug;
    }

    await updateProductInfoSchema.validate(req.body, {
      abortEarly: false,
    });

    if (req.files) {
      const newImages = req.files.map(
        (file) => `public/images/products/${file.filename}`
      );

      if (deleteOldImages === "true") {
        mainProduct.images?.forEach((img) => {
          if (fs.existsSync(img)) {
            fs.unlink(img, (err) => {
              if (err) {
                return next(err);
              }
            });
          }
        });
        mainProduct.images = newImages;
      } else {
        mainProduct.images = [...mainProduct.images, ...newImages];
      }
    }

    const updateProduct = await mainProduct.save();

    return successResponse(res, 200, { product: updateProduct });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Product ID Not Valid !!");
    }

    const remove = await productModel.findByIdAndDelete(id);

    remove?.images?.forEach((img) => {
      if (fs.existsSync(img)) {
        fs.unlink(img, (err) => {
          if (err) {
            return next(err);
          }
        });
      }
    });

    if (!remove) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    await noteModel.deleteMany({ product: id });

    //todo : remove comments and ...

    return successResponse(res, 200, "Product Removed Successfully.");
  } catch (error) {
    next(error);
  }
};
