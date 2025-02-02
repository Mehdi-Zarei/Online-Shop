const cartModel = require("../../../../models/cart");
const productModel = require("../../../../models/product");

const { isValidObjectId } = require("mongoose");

const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.getCart = async (req, res, next) => {
  try {
    const userID = req.user._id;

    const userCart = await cartModel
      .findOne({ user: userID })
      .populate("items.product", "name description images")
      .populate("items.seller", "storeName")
      .populate("user", "name")
      .lean();

    if (!userCart) {
      return errorResponse(res, 404, "Your Cart Is Empty !!");
    }

    const totalCartPrice = userCart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    return successResponse(res, 200, { userCart, totalCartPrice });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productID, sellerID, quantity } = req.body;

    const userID = req.user._id;

    if (!isValidObjectId(productID) || !isValidObjectId(sellerID)) {
      return errorResponse(res, 409, "Product Or Seller ID Not Valid !!");
    }

    const mainProduct = await productModel.findById(productID);

    if (!mainProduct) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    const sellerDetails = mainProduct.sellers.find((s) =>
      s.sellerID.equals(sellerID)
    );

    if (!sellerDetails) {
      return errorResponse(
        res,
        400,
        "This seller does not sell this product !!"
      );
    }

    if (sellerDetails.stock < quantity) {
      return errorResponse(
        res,
        404,
        "This seller's product inventory is less than your requested quantity."
      );
    }

    const priceAtTimeOfAdding = sellerDetails.price;

    const isTheCartExist = await cartModel.findOne({ user: userID });

    if (!isTheCartExist) {
      const newCart = await cartModel.create({
        user: userID,
        items: [
          {
            product: productID,
            seller: sellerID,
            quantity,
            priceAtTimeOfAdding,
            totalPrice: quantity * priceAtTimeOfAdding,
          },
        ],
      });
      return successResponse(res, 201, "Product Added To Cart Successfully.", {
        Cart: newCart,
      });
    }

    const isProductInCart = isTheCartExist.items.find(
      (p) => p.product.equals(productID) && p.seller.equals(sellerID)
    );

    if (isProductInCart) {
      isProductInCart.quantity += quantity;
      isProductInCart.priceAtTimeOfAdding = priceAtTimeOfAdding;
      isProductInCart.totalPrice += priceAtTimeOfAdding * quantity;
    } else {
      isTheCartExist.items.push({
        product: productID,
        seller: sellerID,
        quantity,
        priceAtTimeOfAdding,
        totalPrice: quantity * priceAtTimeOfAdding,
      });
    }

    await isTheCartExist.save();

    return successResponse(res, 200, { Cart: isTheCartExist });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productID, sellerID, quantity } = req.body;

    const userID = req.user._id;

    if (!isValidObjectId(productID) || !isValidObjectId(sellerID)) {
      return errorResponse(res, 409, "Product Or Seller ID Not Valid !!");
    }

    const userCart = await cartModel.findOne({ user: userID });

    if (!userCart) {
      return errorResponse(res, 404, "Cart Not Found !!");
    }

    const mainProduct = await productModel.findById(productID);

    if (!mainProduct) {
      const removeProduct = userCart.items.find((p) =>
        p.product.equals(productID)
      );

      if (removeProduct) {
        userCart.items.pull(removeProduct);
        await userCart.save();
        return errorResponse(
          res,
          404,
          "This product has been discontinued and will be removed from your cart."
        );
      }
      return errorResponse(res, 404, "Product Not Found !!");
    }

    const reduceQuantity = userCart.items.find(
      (p) => p.product.equals(productID) && p.seller.equals(sellerID)
    );

    if (!reduceQuantity) {
      return errorResponse(
        res,
        404,
        "This product is not available in your shopping cart!! "
      );
    }

    if (reduceQuantity.quantity <= quantity) {
      userCart.items.pull(reduceQuantity);
      await userCart.save();
      return successResponse(
        res,
        200,
        "The entire product has been successfully removed from your cart."
      );
    } else {
      reduceQuantity.quantity -= quantity;
      reduceQuantity.totalPrice =
        reduceQuantity.quantity * reduceQuantity.priceAtTimeOfAdding;
    }

    await userCart.save();

    return successResponse(res, 200, { Cart: reduceQuantity });
  } catch (error) {
    next(error);
  }
};
