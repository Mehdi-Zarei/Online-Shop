const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    title: {
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

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      trim: true,
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

subCategorySchema.virtual("child", {
  ref: "childSubCategory",
  localField: "_id",
  foreignField: "parent",
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
