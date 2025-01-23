const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    sellerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    childSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "childSubCategory",
      required: true,
    },

    images: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
    },

    sellers: {
      type: [sellerSchema],
      default: [],
    },

    filterValues: {
      type: Map,
      of: mongoose.Types.Mixed,
      required: true,
    },

    customFilters: {
      type: Map,
      of: String,
      required: true,
    },

    shortIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
