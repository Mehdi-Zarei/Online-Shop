const sellerRequestModel = require("../../../../models/sellerRequests");
const sellerModel = require("../../../../models/seller");
const productModel = require("../../../../models/product");

const { isValidObjectId } = require("mongoose");

const { createPagination } = require("../../../helpers/pagination");

//* Helper Functions
const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.getAllSellerRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const seller = await sellerModel.findOne({ userID: req.user._id });

    if (!seller) {
      return errorResponse(res, 404, "You don't a seller !!");
    }

    const mainSellerRequests = await sellerRequestModel
      .find({ seller }, "-seller -__v")
      .populate("product", "name description images")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(10)
      .lean();

    if (mainSellerRequests.length === 0) {
      return errorResponse(res, 404, "You don't have any requests !!");
    }

    const pagination = createPagination(
      page,
      limit,
      mainSellerRequests.length,
      "SellerRequests"
    );

    return successResponse(res, 200, {
      sellerRequests: mainSellerRequests,
      pagination,
    });
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
