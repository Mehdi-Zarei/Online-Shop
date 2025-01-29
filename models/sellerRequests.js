const mongoose = require("mongoose");

const sellerRequestSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
    requestStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    adminMessage: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const sellerRequest = mongoose.model("SellerRequest", sellerRequestSchema);

module.exports = sellerRequest;
