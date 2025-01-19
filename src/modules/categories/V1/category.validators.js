const yup = require("yup");

const categorySchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug must contain lowercase letters, numbers, and hyphens only"
    ),
  description: yup.string().optional(),
  filters: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Filter name is required"),
        type: yup
          .string()
          .oneOf(["selectbox", "radio"], "Invalid filter type")
          .required("Filter type is required"),
        options: yup
          .array()
          .of(yup.string().required("Options cannot be empty"))
          .min(1, "At least one option is required")
          .required("Options are required"),
      })
    )
    .optional()
    .transform((value, originalValue) => {
      // If filters is sent as a JSON string, parse it into an array
      if (typeof originalValue === "string") {
        try {
          return JSON.parse(originalValue);
        } catch (err) {
          return originalValue; // If parsing fails, return the original value
        }
      }
      return value; // If it's not a string, return the original value
    }),
});

const updateCategorySchema = yup.object().shape({
  title: yup.string().min(3, "Title must be at least 3 characters long"),
  slug: yup
    .string()
    .matches(
      /^[a-z0-9-]+$/,
      "Slug must contain lowercase letters, numbers, and hyphens only"
    ),
  description: yup.string().optional(),
  filters: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string(),
        type: yup.string().oneOf(["selectbox", "radio"], "Invalid filter type"),
        options: yup
          .array()
          .of(yup.string().required("Options cannot be empty"))
          .min(1, "At least one option is required"),
      })
    )
    .optional()
    .transform((value, originalValue) => {
      // If filters is sent as a JSON string, parse it into an array
      if (typeof originalValue === "string") {
        try {
          return JSON.parse(originalValue);
        } catch (err) {
          return originalValue; // If parsing fails, return the original value
        }
      }
      return value; // If it's not a string, return the original value
    }),
});

module.exports = { categorySchema, updateCategorySchema };
