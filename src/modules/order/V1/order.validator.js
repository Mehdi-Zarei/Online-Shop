const yup = require("yup");

const updateOrderSchema = yup.object({
  postTrackingCode: yup
    .number()
    .typeError("postTrackingCode must be a number")
    .required("postTrackingCode is required"),

  status: yup
    .string()
    .oneOf(
      ["PROCESSING", "SHIPPED", "DELIVERED"],
      "Invalid status value!!status value must be one of the 'PROCESSING' 'SHIPPED' 'DELIVERED'"
    )
    .required("status is required"),
});

module.exports = { updateOrderSchema };
