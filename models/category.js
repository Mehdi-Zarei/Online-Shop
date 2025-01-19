const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: {
        filename: { type: String, required: true, trim: true },
        path: { type: String, required: true, trim: true },
      },
    },
    filters: [
      {
        name: { type: String, required: true, trim: true },
        type: { type: String, enum: ["radio", "selectbox"], required: true },
        options: [{ type: String, default: undefined }],
      },
    ],
  },
  { timestamps: true }
);

categorySchema.virtual("subCategories", {
  ref: "SubCategory", // مدل مرجع
  localField: "_id", // فیلد محلی (آیدی دسته‌بندی اصلی)
  foreignField: "parent", // فیلد خارجی (فیلدی در SubCategory که به Category رفرنس می‌دهد)
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
