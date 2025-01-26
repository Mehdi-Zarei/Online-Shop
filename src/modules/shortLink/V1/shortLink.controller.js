const productModel = require("../../../../models/product");
const { errorResponse } = require("../../../helpers/responseMessage");

exports.redirectToProductPage = async (req, res, next) => {
  try {
    const { shortIdentifier } = req.params;

    const product = await productModel.findOne({ shortIdentifier }).lean();

    if (!product) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    return res.redirect(`/api/v1/products/${product._id}`);
  } catch (error) {
    next(error);
  }
};
