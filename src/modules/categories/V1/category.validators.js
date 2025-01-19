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

const subCategorySchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required") // Title is required
    .min(3, "Title must be at least 3 characters long"), // Title must be at least 3 characters long
  slug: yup
    .string()
    .required("Slug is required") // Slug is required
    .matches(
      /^[a-z0-9-]+$/i,
      "Slug must contain letters, numbers, and hyphens only"
    ), // Slug must contain letters, numbers, and hyphens only
  parent: yup
    .string()
    .required("Parent category ID is required") // Parent category ID is required
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid parent category ID"), // Parent ID must be a valid MongoDB ID
  description: yup.string().optional(), // Description is optional
  filters: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Filter name is required"), // Filter name is required
        slug: yup.string().required("Filter slug is required"), // Filter slug is required
        type: yup
          .string()
          .oneOf(["selectbox", "radio"], "Invalid filter type") // Filter type must be either "selectbox" or "radio"
          .required("Filter type is required"), // Filter type is required
        description: yup.string().optional(), // Filter description is optional
        options: yup
          .array()
          .of(yup.string().required("Options cannot be empty")) // Options cannot be empty
          .min(1, "At least one option is required") // At least one option is required
          .required("Options are required"), // Options are required
      })
    )
    .optional() // Filters are optional
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

module.exports = { categorySchema, updateCategorySchema, subCategorySchema };
