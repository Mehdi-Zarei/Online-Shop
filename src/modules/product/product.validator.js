const yup = require("yup");

const createProductSchema = yup.object({
  name: yup.string().required("Name is required").min(5),

  description: yup.string().required("Description is required"),

  childSubCategory: yup.string().required("Child SubCategory is required"),
  filterValues: yup
    .mixed()
    .required("Filter Values are required")
    .transform((originalValue) => {
      if (typeof originalValue === "string") {
        try {
          return JSON.parse(originalValue);
        } catch (error) {
          throw new yup.ValidationError("Invalid JSON format for filterValues");
        }
      }
      return originalValue;
    })
    .test("is-object", "filterValues must be an object", (value) => {
      return value && typeof value === "object" && !Array.isArray(value);
    }),

  customFilters: yup
    .mixed()
    .required("Custom Filters are required")
    .transform((originalValue) => {
      if (typeof originalValue === "string") {
        try {
          return JSON.parse(originalValue);
        } catch (error) {
          throw new yup.ValidationError(
            "Invalid JSON format for customFilters"
          );
        }
      }
      return originalValue;
    })
    .test("is-object", "customFilters must be an object", (value) => {
      return value && typeof value === "object" && !Array.isArray(value);
    }),

  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-zA-Z0-9 ]+$/,
      "Slug can only contain English letters, numbers, and spaces"
    )
    .max(50, "Slug must not exceed 50 characters"), // محدودیت تعداد کاراکتر

  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number"),

  stock: yup
    .number()
    .required("Stock is required")
    .integer("Stock must be an integer")
    .min(1, "Stock cannot be less than 1"),
});

module.exports = { createProductSchema };
