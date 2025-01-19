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
    const categories = await categoryModel
      .find()
      .populate({
        path: "subCategories",
        select: "-__v",
        populate: {
          path: "child",
          select: "-__v",
        },
      })
      .select("-__v")
      .lean();

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
      const pathIcon = updateCategory.icon?.path;

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

exports.getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await subCategoryModel
      .find()
      .populate("parent", "-__v")
      .populate("child", "-__v")
      .select("-__v")
      .lean();

    if (subCategories.length === 0) {
      return errorResponse(
        res,
        404,
        "You don't have any sub categories yet !!"
      );
    }

    return successResponse(res, 200, subCategories);
  } catch (error) {
    next(error);
  }
};

exports.updateSubCategory = async (req, res, next) => {
  try {
    const { subCategoryID } = req.params;

    const { title, slug, parent, description, filters } = req.body;

    //todo: validator

    if (!isValidObjectId(subCategoryID)) {
      return errorResponse(res, 409, "Sub Category ID Not Valid !!");
    }

    const subCategory = await subCategoryModel.findByIdAndUpdate(
      subCategoryID,
      { title, slug, parent, description, filters },
      { new: true }
    );

    if (!subCategory) {
      return errorResponse(res, 404, "Sub Category Not Found !!");
    }

    return successResponse(res, 200, "Sub Category Updated Successfully.", {
      updateInfo: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeSubCategory = async (req, res, next) => {
  try {
    const { subCategoryID } = req.params;

    if (!isValidObjectId(subCategoryID)) {
      return errorResponse(res, 409, "Sub Category ID Not valid !!");
    }

    const removeSubCategory = await subCategoryModel.findByIdAndDelete(
      subCategoryID
    );

    if (!removeSubCategory) {
      return errorResponse(res, 404, "Sub Category Not Found !!");
    }

    const removeChildSubCategory = await childSubCategoryModel.deleteMany({
      parent: removeSubCategory._id,
    });

    return successResponse(res, 200, "Sub Category Removed Successfully.", {
      subCategory: removeSubCategory,
      childSubCategory: removeChildSubCategory,
    });
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

exports.getAllChildSubCategories = async (req, res, next) => {
  try {
    const childSubCategories = await childSubCategoryModel
      .find()
      .populate("parent")
      .lean();

    if (childSubCategories.length === 0) {
      return errorResponse(
        res,
        404,
        "You don't have any child sub categories yet !!"
      );
    }

    return successResponse(res, 200, childSubCategories);
  } catch (error) {
    next(error);
  }
};

exports.updateChildSubCategory = async (req, res, next) => {
  try {
    const { childSubCategoryID } = req.params;

    if (!isValidObjectId(childSubCategoryID)) {
      return errorResponse(res, 409, "Child Sub Category ID Not Valid !!");
    }

    const { title, slug, parent, description, filters } = req.body;

    //Todo : Validator

    const update = await childSubCategoryModel.findByIdAndUpdate(
      childSubCategoryID,
      {
        title,
        slug,
        parent,
        description,
        filters,
      },
      { new: true }
    );

    if (!update) {
      return errorResponse(
        res,
        409,
        "Child Sub Category Not Found Whit This ID !!"
      );
    }

    return successResponse(
      res,
      200,
      "Child Sub Category Updated Successfully.",
      {
        childSubCategory: update,
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.removeChildSubCategory = async (req, res, next) => {
  try {
    const { childSubCategoryID } = req.params;

    if (!isValidObjectId(childSubCategoryID)) {
      return errorResponse(res, 409, "Child Sub Category ID Not Valid !!");
    }

    const remove = await childSubCategoryModel.findByIdAndDelete(
      childSubCategoryID
    );

    if (!remove) {
      return errorResponse(res, 404, "Child Sub Category Not Found !!");
    }

    return successResponse(
      res,
      200,
      "Child Sub Category Removed Successfully.",
      {
        childSubCategory: remove,
      }
    );
  } catch (error) {
    next(error);
  }
};

//! End Child Sub Categories Functions
