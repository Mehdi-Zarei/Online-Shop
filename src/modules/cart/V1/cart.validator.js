const yup = require("yup");

const cartItemSchema = yup.object().shape({
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("Quantity must be a positive number")
    .min(1, "Quantity must be at least 1")
    .integer("Quantity must be an integer"),
});

module.exports = { cartItemSchema };
