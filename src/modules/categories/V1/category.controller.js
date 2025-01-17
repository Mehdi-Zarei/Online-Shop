const { isValidObjectId } = require("mongoose");
const fs = require("fs");
const categoryModel = require("../../../../models/category");

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

    if (remove) {
      const pathIcon = remove.icon.path;

      fs.unlinkSync(pathIcon, (err) => {
        next(err);
      });

      return successResponse(
        res,
        200,
        "Category Deleted Successfully.",
        remove
      );
    }

    return errorResponse(res, 404, "Category Not Found !!");
  } catch (error) {
    next(error);
  }
};
