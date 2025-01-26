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
    //todo
    const { id } = req.params;

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

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Product ID Not Valid !!");
    }

    let images = req.files.map(
      (file) => `public/images/products/${file.filename}`
    );

    await updateProductInfoSchema.validate(req.body, {
      abortEarly: false,
    });

    // if (!isValidObjectId(childSubCategory)) {
    //   return errorResponse(res, 409, "Child Sub Category ID Not Valid !!");
    // }

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

    const updateProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        childSubCategory,
        filterValues,
        customFilters,
        slug,
        images,
        shortIdentifier,
        sellers,
      },
      { new: true }
    );

    return successResponse(res, 200, updateProduct);
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
