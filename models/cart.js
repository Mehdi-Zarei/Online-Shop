const mongoose = require("mongoose");

const cartItemsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtTimeOfAdding: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [cartItemsSchema],
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const cart = mongoose.model("cart", cartSchema);

module.exports = cart;
