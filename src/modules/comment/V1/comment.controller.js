const { isValidObjectId } = require("mongoose");
const commentModel = require("../../../../models/comment");
const userModel = require("../../../../models/users");
const productModel = require("../../../../models/product");

//* Helper Functions
const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.getAllComments = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { productID, content, score } = req.body;

    if (!isValidObjectId(productID)) {
      return errorResponse(res, 409, "Product ID Not valid !!");
    }

    const userID = req.user._id;

    const mainProduct = await productModel.findById(productID);

    if (!mainProduct) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    const newComment = await commentModel.create({
      user: userID,
      product: productID,
      isAccept: false,
      score,
      content,
      replies: [],
    });

    return successResponse(res, 201, "New Comment Created Successfully.", {
      Comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

exports.editComment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.removeComment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.addReplay = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.removeReplay = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.editReplay = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
