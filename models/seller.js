const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    contactDetails: {
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
      },
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
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Seller", sellerSchema);

module.exports = model;
