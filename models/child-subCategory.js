const mongoose = require("mongoose");

const childSubCategorySchema = new mongoose.Schema({
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
    ref: "SubCategory",
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
});

module.exports = mongoose.model("childSubCategory", childSubCategorySchema);
