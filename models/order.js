const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
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

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

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

    postTrackingCode: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PROCESSING", "SHIPPED", "DELIVERED"],
      default: "PROCESSING",
    },

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
  },
  { timestamps: true }
);

const model = mongoose.model("Order", orderSchema);

module.exports = model;
