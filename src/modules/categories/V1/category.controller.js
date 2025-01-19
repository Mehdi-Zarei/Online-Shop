const { isValidObjectId } = require("mongoose");
const fs = require("fs");

const categoryModel = require("../../../../models/category");
const subCategoryModel = require("../../../../models/subCategory");
const childSubCategoryModel = require("../../../../models/child-subCategory");

const {
  successResponse,
  errorResponse,
} = require("../../../helpers/responseMessage");

//* Start Main Categories Functions
exports.createMainCategory = async (req, res, next) => {
  try {
    let { title, slug, description, filters } = req.body;
    filters = JSON.parse(filters);

    //Todo : Validator

    const isCategoryExist = await categoryModel.findOne({ title, slug });

    if (isCategoryExist) {
      return errorResponse(res, 409, "This Category Already Exist !!");
    }

    let icon = null;

    if (req.file) {
      icon = {
        filename: req.file.filename,
        path: `public/icon/category/${req.file.filename}`,
      };
    }

    const newCategory = await categoryModel.create({
      title,
      slug,
      description,
      filters,
      icon,
    });

    return successResponse(res, 201, newCategory);
  } catch (error) {
    next(error);
  }
};

exports.getAllMainCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find({}, "-__v");

    if (categories.length === 0) {
      return errorResponse(res, 404, "You don't have any categories yet !!");
    }
    return successResponse(res, 200, categories);
  } catch (error) {
    next(error);
  }
};

exports.updateMainCategory = async (req, res, next) => {
  try {
    const { categoryID } = req.params;

    let { title, slug, parent, description, filters } = req.body;
    filters = JSON.parse(filters);

    //Todo : Validator

    if (!isValidObjectId(categoryID)) {
      return errorResponse(res, 409, "Category ID Not Valid !!");
    }
    let icon = null;

    if (req.file) {
      icon = {
        filename: req.file.filename,
        path: `public/icon/category/${req.file.filename}`,
      };
    }

    const updateCategory = await categoryModel.findByIdAndUpdate(categoryID, {
      title,
      slug,
      parent,
      description,
      filters,
      icon,
    });

    if (updateCategory) {
      const pathIcon = updateCategory.icon.path;

      fs.unlinkSync(pathIcon, (err) => {
        next(err);
      });

      return successResponse(res, 200, "Category Updated Successfully.");
    }
    return errorResponse(res, 404, "Category Not Found For Update !!");
  } catch (error) {
    next(error);
  }
};

exports.removeMainCategory = async (req, res, next) => {
  try {
    const { categoryID } = req.params;

    if (!isValidObjectId(categoryID)) {
      return errorResponse(res, 409, "Category ID Not Valid !!");
    }

    const removeMainCategory = await categoryModel.findByIdAndDelete(
      categoryID
    );

    if (!removeMainCategory) {
      return errorResponse(res, 404, "Category Not Found !!");
    }

    const subCategory = await subCategoryModel.find({ parent: categoryID });

    const extractSubCategoriesIds = subCategory.map((sub) => sub._id);

    const childSubCategory = await childSubCategoryModel.find({
      parent: { $in: extractSubCategoriesIds },
    });

    await subCategoryModel.deleteMany({ parent: categoryID });

    await childSubCategoryModel.deleteMany({ parent: extractSubCategoriesIds });

    const pathIcon = removeMainCategory.icon?.path;

    if (pathIcon) {
      fs.unlinkSync(pathIcon, (err) => {
        return next(err);
      });
    }

    return successResponse(
      res,
      200,
      "Category With Sub and Child Deleted Successfully.",
      {
        category: removeMainCategory,
        subCategory,
        childSubCategory,
      }
    );
  } catch (error) {
    next(error);
  }
};
//! End Main Categories Functions

//* Start Sub Categories Functions
exports.createSubCategory = async (req, res, next) => {
  try {
    const { title, slug, parent, description, filters } = req.body;

    //Todo : Validator

    const isSubCategoryExist = await subCategoryModel.findOne({ title, slug });

    if (isSubCategoryExist) {
      return errorResponse(res, 409, "This Sub Category Already Exist !!");
    }

    const isParentExist = await categoryModel.findById(parent);

    if (!isParentExist) {
      return errorResponse(res, 404, "Parent ID Not Found !!");
    }

    const newSubCategory = await subCategoryModel.create({
      title,
      slug,
      parent,
      description,
      filters,
    });

    return successResponse(
      res,
      201,
      "SubCategory Created Successfully.",
      newSubCategory
    );
  } catch (error) {
    next(error);
  }
};

//! End Sub Categories Functions

//* Start  Child Sub Categories Functions
exports.createChildSubCategory = async (req, res, next) => {
  try {
    const { title, slug, parent, description, filters } = req.body;

    //Todo : Validator

    const isChildSubCategoryExist = await childSubCategoryModel.findOne({
      title,
      slug,
    });

    if (isChildSubCategoryExist) {
      return errorResponse(res, 409, "This Sub Category Already Exist !!");
    }

    const isParentExist = await subCategoryModel.findById(parent);

    if (!isParentExist) {
      return errorResponse(res, 404, "Parent ID Not Found !!");
    }

    const newChildSubCategory = await childSubCategoryModel.create({
      title,
      slug,
      parent,
      description,
      filters,
    });

    return successResponse(
      res,
      201,
      "New Child Sub Category Created Successfully.",
      newChildSubCategory
    );
  } catch (error) {
    next(error);
  }
};
//! End Child Sub Categories Functions
