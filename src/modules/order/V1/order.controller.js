const { isValidObjectId } = require("mongoose");
const orderModel = require("../../../../models/order");

const { createPagination } = require("../../../helpers/pagination");

const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user;

    const filters = {
      ...(user.roles.some((role) => ["OWNER", "ADMIN"].includes(role))
        ? {}
        : { user: user._id }),
    };

    const orders = await orderModel
      .find(filters)
      .select("-authority -__v")
      .populate("user", "name")
      .populate("items.product", "name description images")
      .populate("items.seller", "storeName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (orders.length === 0) {
      return errorResponse(res, 404, "Order Not Found !!");
    }

    const pagination = createPagination(page, limit, orders.length, "Orders");

    return successResponse(res, 200, { orders, pagination });
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { postTrackingCode, status } = req.body;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "Order ID Not Valid !!");
    }

    const updateOrder = await orderModel.findByIdAndUpdate(
      id,
      {
        postTrackingCode,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updateOrder) {
      return errorResponse(res, 404, "Order Not Found !!");
    }

    return successResponse(res, 200, updateOrder);
  } catch (error) {
    next(error);
  }
};
