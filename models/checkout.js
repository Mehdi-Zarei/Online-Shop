const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema(
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

    priceAtTimeOfPurchase: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [checkoutItemSchema],

    shippingAddress: [
      {
        addressName: {
          type: String,
          required: true,
        },
        postalCode: {
          type: Number,
          required: true,
        },
        location: {
          lat: {
            // طول جغرافیایی
            type: Number,
            required: true,
          },
          lng: {
            // عرض جغرافیایی
            type: Number,
            required: true,
          },
        },
        provincesID: {
          type: Number,
          required: true,
        },

        cityID: {
          type: Number,
          required: true,
        },
        physicalAddress: {
          type: String,
          required: true,
        },
      },
    ],

    authority: {
      type: String,
      unique: true,
      required: true,
    },
    totalCartPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 60 * 60 * 1000,
    },
  },
  { timestamps: true }
);

//* TTL
checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const model = mongoose.model("Checkout", checkoutSchema);

module.exports = model;
