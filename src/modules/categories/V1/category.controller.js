const { isValidObjectId } = require("mongoose");
const fs = require("fs");
const categoryModel = require("../../../../models/category");
const subCategoryModel = require("../../../../models/subCategory");

const {
  successResponse,
  errorResponse,
} = require("../../../helpers/responseMessage");

exports.createCategory = async (req, res, next) => {
  try {
    let { title, slug, parent, description, filters } = req.body;
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
      parent,
      description,
      filters,
      icon,
    });

    return successResponse(res, 201, newCategory);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
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

exports.removeCategory = async (req, res, next) => {
  try {
    const { categoryID } = req.params;

    if (!isValidObjectId(categoryID)) {
      return errorResponse(res, 409, "Category ID Not Valid !!");
    }

    const remove = await categoryModel.findByIdAndDelete(categoryID);

    if (!remove) {
      return errorResponse(res, 404, "Category Not Found !!");
    }

    const pathIcon = remove.icon?.path;

    if (pathIcon) {
      fs.unlinkSync(pathIcon, (err) => {
        return next(err);
      });
    }

    return successResponse(res, 200, "Category Deleted Successfully.", remove);
  } catch (error) {
    next(error);
  }
};

exports.createSubCategory = async (req, res, next) => {
  try {
    const { title, slug, parent, description, filters } = req.body;

    //Todo : Validator

    const isSubCategoryExist = await subCategoryModel.findOne({ title, slug });

    if (isSubCategoryExist) {
      return errorResponse(res, 409, "This Category Already Exist !!");
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
