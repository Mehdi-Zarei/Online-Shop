const yup = require("yup");

const createCheckoutSchema = yup.object({
  shippingAddressID: yup.string().required("shippingAddressID is required"),
});

module.exports = { createCheckoutSchema };
