const yup = require("yup");
const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const sellerRequestSchema = yup.object().shape({
  product: yup
    .string()
    .test("is-objectid", "Product ID must be a valid ObjectId", isValidObjectId)
    .required("Product ID is required"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Price is required"),

  stock: yup
    .number()
    .typeError("Stock must be a number")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
});

const updateSellerRequestStatusSchema = yup.object().shape({
  requestStatus: yup
    .string()
    .oneOf(
      ["Accepted", "Rejected"],
      "Invalid request status !! Request Status Must Be Accepted  Or Rejected"
    )
    .default("Pending"),
  adminMessage: yup
    .string()
    .trim()
    .max(500, "Admin message cannot exceed 500 characters")
    .nullable(),
});

module.exports = { sellerRequestSchema, updateSellerRequestStatusSchema };
