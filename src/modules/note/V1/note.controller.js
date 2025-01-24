const noteModel = require("../../../../models/note");
const productModel = require("../../../../models/product");

const { isValidObjectId } = require("mongoose");

const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.create = async (req, res, next) => {
  try {
    const { productID, content } = req.body;

    const user = req.user._id;

    if (!isValidObjectId(productID)) {
      return errorResponse(res, 409, "Product ID Not Valid !!");
    }

    const isExistProduct = await productModel.findById(productID);

    if (!isExistProduct) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    const isTheNoteRepetitive = await noteModel
      .findOne({ user }, { productID })
      .lean();

    if (isTheNoteRepetitive) {
      return errorResponse(
        res,
        409,
        "Note has already been saved for this product !!"
      );
    }

    const newNote = await noteModel.create({
      user,
      product: productID,
      content,
    });

    return successResponse(res, 201, "New Note Created Successfully.", newNote);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
