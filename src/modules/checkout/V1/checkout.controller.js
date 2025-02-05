const cartModel = require("../../../../models/cart");
const productModel = require("../../../../models/product");
const checkoutModel = require("../../../../models/checkout");

const { isValidObjectId } = require("mongoose");

const { createPayment } = require("../../../services/zarinpal");

const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.createCheckout = async (req, res, next) => {
  try {
    const { shippingAddressID } = req.body;
    const user = req.user;

    if (!isValidObjectId(shippingAddressID)) {
      return errorResponse(res, 409, "Shipping Address ID Not Valid !!");
    }

    const selectedAddress = user.addresses.id(shippingAddressID);

    if (!selectedAddress) {
      return errorResponse(res, 404, "Address Not Found !!");
    }

    const formattedAddress = {
      location: selectedAddress.location,
      addressName: selectedAddress.addressName,
      postalCode: selectedAddress.postalCode,
      provincesID: selectedAddress.provincesID,
      cityID: selectedAddress.cityID,
      physicalAddress: selectedAddress.physicalAddress,
    };

    const cart = await cartModel.findOne({ user: user._id });

    if (!cart?.items?.length) {
      return errorResponse(res, 404, "Cart Not Found Or Empty !!");
    }

    const productIds = cart.items.map((item) => item.product);

    const sellerIds = cart.items.map((item) => item.seller);

    const existingProducts = await productModel
      .find({
        _id: { $in: productIds },
        "sellers.sellerID": { $in: sellerIds },
      })
      .lean();

    const validProductIds = existingProducts.map((p) => p._id.toString());

    cart.items.forEach((item) => {
      if (!validProductIds.includes(item.product.toString())) {
        return errorResponse(res, 400, "Seller does not sell this product !!");
      }
    });

    const checkoutItems = JSON.parse(JSON.stringify(cart.items));

    const newCheckout = new checkoutModel({
      user: user._id,
      items: checkoutItems,
      shippingAddress: formattedAddress,
      totalCartPrice: cart.totalCartPrice,
    });

    const payment = await createPayment({
      amountInRial: cart.totalCartPrice,
      description: `سفارش با شناسه ${newCheckout._id}`,
      mobile: user.phone,
    });

    newCheckout.authority = payment.authority;

    await newCheckout.save();

    return successResponse(res, 201, {
      message: "Checkout created successfully :))",
      checkout: newCheckout,
      paymentUrl: payment.paymentUrl,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    next(error);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
