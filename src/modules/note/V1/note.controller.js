const noteModel = require("../../../../models/note");
const productModel = require("../../../../models/product");

const { isValidObjectId } = require("mongoose");

const { createPagination } = require("../../../helpers/pagination");

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
    const { page = 1, limit = 10 } = req.query;

    const userID = req.user._id;

    const notes = await noteModel
      .find({ user: userID }, "-user -__v")
      .populate("product", "name description images")
      .lean()
      .skip((page - 1) * limit)
      .limit(limit);

    if (!notes) {
      return errorResponse(
        res,
        404,
        "You Don't Have Any Notes Yet Or Your Note's Removed After Product Deleted !!"
      );
    }

    const totalNoteCount = await noteModel.countDocuments({ user: userID });

    const pagination = createPagination(page, limit, totalNoteCount, "Note's");

    return successResponse(res, 200, { notes, pagination });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userID = req.user._id;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Note ID Not Valid !!");
    }

    const mainNote = await noteModel
      .findOne({
        $and: [{ _id: id, user: userID }],
      })
      .populate("product", "name description images")
      .select("-user -__v")
      .lean();

    if (!mainNote) {
      return errorResponse(res, 404, "Note Not Found With This ID !!");
    }

    return successResponse(res, 200, { note: mainNote });
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userID = req.user._id;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Not ID Not Valid !!");
    }

    const update = await noteModel.findOneAndUpdate(
      { $and: [{ _id: id, user: userID }] },
      { content },
      { new: true }
    );

    if (!update) {
      return errorResponse(
        res,
        404,
        "Note Not Found Or Your Notes Removed After Product Deleted !!"
      );
    }

    return successResponse(res, 200, { updatedNote: update });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Note ID Not Valid !!");
    }

    const remove = await noteModel.findOneAndDelete({
      $and: [{ _id: id, user: user._id }],
    });

    if (!remove) {
      return errorResponse(res, 404, "Note Not Found !!");
    }

    return successResponse(res, 200, "Note Removed Successfully.");
  } catch (error) {
    next(error);
  }
};
