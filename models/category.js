const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
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
      options: [{ type: String }],
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
