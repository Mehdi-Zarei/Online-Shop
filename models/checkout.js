const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema({
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

  priceAtTimeOfPurchase: {
    type: Number,
    required: true,
  },
});

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [checkoutItemSchema],

    shippingAddress: {
      type: String,
      required: true,
    },

    authority: {
      type: String,
      unique: true,
      required: true,
    },

    expiresAt: {
      // TTL -> Time To Live
      type: Date,
      required: true,
      default: () => Date.now() + 60 * 60 * 1000, // 1 Hour from creation
    },
  },
  { timestamps: true }
);

checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const model = mongoose.model("Checkout", checkoutSchema);

module.exports = model;
