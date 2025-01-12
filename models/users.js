const mongoose = require("mongoose");

const addressesSchema = new mongoose.Schema(
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
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      type: [String],
      enum: ["OWNER", "ADMIN", "USER", "SELLER", "AUTHOR"],
      default: ["USER"],
    },
    provider: {
      type: [String],
      enum: ["local", "google"],
      default: ["local"],
    },
    addresses: [addressesSchema],

    avatar: {
      type: String,
      default: "null",
    },
    isRestrict: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
