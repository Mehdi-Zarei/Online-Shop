const cartModel = require("../../../../models/cart");
const productModel = require("../../../../models/product");
const checkoutModel = require("../../../../models/checkout");
const orderModel = require("../../../../models/order");

const { isValidObjectId } = require("mongoose");

const { createPayment, verifyPayment } = require("../../../services/zarinpal");

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

    const newPayment = await createPayment({
      amountInRial: cart.totalCartPrice,
      description: `سفارش با شناسه ${newCheckout._id}`,
      mobile: user.phone,
    });

    newCheckout.authority = newPayment.authority;

    await newCheckout.save();

    return successResponse(res, 201, {
      message: "Checkout created successfully :))",
      checkout: newCheckout,
      paymentUrl: newPayment.paymentUrl,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  try {
    const { Status, Authority: authority } = req.query;

    const alreadyCreatedOrder = await orderModel.findOne({ authority });

    if (alreadyCreatedOrder) {
      return errorResponse(res, 400, "Payment Already Verified !!");
    }

    const checkoutExist = await checkoutModel.findOne({ authority });

    if (!checkoutExist) {
      return errorResponse(res, 404, "Checkout Not Found !!");
    }

    const verifyPaymentStatus = await verifyPayment({
      amountInRial: checkoutExist.totalCartPrice,
      authority,
    });

    if (![100, 101].includes(verifyPaymentStatus.code) || Status !== "OK") {
      return errorResponse(res, 400, "Payment Not Verified !!");
    }

    for (const item of checkoutExist.items) {
      const product = await productModel.findById(item.product);

      if (product) {
        const sellerInfo = product.sellers.find((sellerData) =>
          sellerData.sellerID.equals(item.seller)
        );

        if (sellerInfo && sellerInfo.stock >= item.quantity) {
          sellerInfo.stock -= item.quantity;
          await product.save();
        } else {
          throw new Error("Insufficient product inventory");
        }
      }
    }

    const orderItems = JSON.parse(JSON.stringify(checkoutExist.items));

    const shippingAddress = JSON.parse(
      JSON.stringify(checkoutExist.shippingAddress)
    );

    const newOrder = new orderModel({
      user: checkoutExist.user,
      items: orderItems,
      shippingAddress,
      authority: checkoutExist.authority,
      totalCartPrice: checkoutExist.totalCartPrice,
    });

    await newOrder.save();

    await cartModel.findOneAndUpdate(
      { user: checkoutExist.user },
      { items: [] }
    );

    await checkoutExist.deleteOne(checkoutExist._id);

    return successResponse(
      res,
      201,
      "Payment Verified Successfully.",
      newOrder
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};
