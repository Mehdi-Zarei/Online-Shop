const sellerRequestModel = require("../../../../models/sellerRequests");
const sellerModel = require("../../../../models/seller");
const productModel = require("../../../../models/product");

//* Helper Functions
const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");
const { isValidObjectId } = require("mongoose");

exports.getAllSellerRequests = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.createSellerRequests = async (req, res, next) => {
  try {
    const { product, price, stock } = req.body;
    const sellerID = req.user._id;

    if (!isValidObjectId(product)) {
      return errorResponse(res, 409, "Product ID Not Valid !!");
    }

    const mainSeller = await sellerModel.findOne({ userID: sellerID });

    if (!mainSeller) {
      return errorResponse(res, 404, "You are not a seller !!");
    }

    if (!mainSeller?.isActive) {
      return errorResponse(res, 409, "Your Shop Not Active !!");
    }

    const mainProduct = await productModel.findById(product);

    if (!mainProduct) {
      return errorResponse(res, 404, "Product Not Found With This ID !!");
    }

    const isTheRequestDuplicated = await sellerRequestModel.findOne({
      $and: [{ seller: mainSeller, product }],
    });

    if (isTheRequestDuplicated) {
      return errorResponse(
        res,
        409,
        "You have already applied to sell this product."
      );
    }

    const newSellerRequest = await sellerRequestModel.create({
      seller: mainSeller,
      product: mainProduct,
      price,
      stock,
      requestStatus: "Pending",
      adminMessage: "Your request is under review.",
    });

    return successResponse(res, 201, "Your Request Sent Successfully.", {
      Request: newSellerRequest,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOneSellerRequests = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.updateSellerRequestsStatus = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.deleteSellerRequests = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
