const { isValidObjectId } = require("mongoose");
const yup = require("yup");

const createProductSchema = yup.object({
  name: yup.string().required("Name is required").min(5),

  description: yup.string().required("Description is required"),

  childSubCategory: yup
    .string()
    .required("Child SubCategory is required")
    .test(
      "is-valid-objectid",
      "Category ID must be a valid ObjectId",
      isValidObjectId
    ),
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

  sellers: yup
    .array()
    .transform((value, originalValue) => {
      try {
        return JSON.parse(originalValue);
      } catch (err) {
        return null;
      }
    })
    .test("is-array", "Input must be a valid JSON array", (value) =>
      Array.isArray(value)
    )
    .of(
      yup.object().shape({
        sellerID: yup
          .string()
          .required("Seller ID is required")
          .test(
            "is-valid-objectid",
            "Seller ID must be a valid ObjectId",
            isValidObjectId
          ),
        price: yup
          .number()
          .positive("Price must be a positive number")
          .required("Price is required"),
        stock: yup
          .number()
          .integer("Stock must be an integer")
          .min(0, "Stock cannot be negative")
          .required("Stock is required"),
      })
    )
    .required("Input is required")
    .min(1, "Array must contain at least one item"),

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
    .max(50, "Slug must not exceed 50 characters"),
});

// const updateProductInfoSchema = yup.object({
//   name: yup.string().min(5),

//   description: yup.string(),

//   // بررسی Optional بودن childSubCategory
//   childSubCategory: yup
//     .string()
//     .test(
//       "is-valid-objectid",
//       "Category ID must be a valid ObjectId",
//       (value) => {
//         if (!value) return true; // اگر فیلد خالی است، ارور نده
//         return isValidObjectId(value);
//       }
//     )
//     .nullable()
//     .optional(),

//   // بررسی Optional بودن filterValues
//   filterValues: yup
//     .mixed()
//     .transform((originalValue) => {
//       if (!originalValue) return undefined; // اگر فیلد خالی است، به طور پیش‌فرض undefined بشه
//       try {
//         return typeof originalValue === "string"
//           ? JSON.parse(originalValue)
//           : originalValue;
//       } catch (error) {
//         return originalValue; // اگر تبدیل JSON نشد، خود اصل مقدار رو برگردون
//       }
//     })
//     .test("is-object", "filterValues must be an object", (value) => {
//       return !value || (typeof value === "object" && !Array.isArray(value));
//     })
//     .nullable()
//     .optional(),

//   // بررسی Optional بودن sellers
//   sellers: yup
//     .array()
//     .transform((originalValue) => {
//       if (!originalValue) return undefined;
//       try {
//         return typeof originalValue === "string"
//           ? JSON.parse(originalValue)
//           : originalValue;
//       } catch (err) {
//         return originalValue;
//       }
//     })
//     .test("is-array", "Input must be a valid JSON array", (value) =>
//       Array.isArray(value)
//     )
//     .of(
//       yup.object().shape({
//         sellerID: yup
//           .string()
//           .test(
//             "is-valid-objectid",
//             "Seller ID must be a valid ObjectId",
//             isValidObjectId
//           ),
//         price: yup.number().positive("Price must be a positive number"),
//         stock: yup
//           .number()
//           .integer("Stock must be an integer")
//           .min(0, "Stock cannot be negative"),
//       })
//     )
//     .min(1, "Array must contain at least one item")
//     .nullable()
//     .optional(),

//   // بررسی Optional بودن customFilters
//   customFilters: yup
//     .mixed()
//     .transform((originalValue) => {
//       if (!originalValue) return undefined;
//       try {
//         return typeof originalValue === "string"
//           ? JSON.parse(originalValue)
//           : originalValue;
//       } catch (error) {
//         return originalValue;
//       }
//     })
//     .test("is-object", "customFilters must be an object", (value) => {
//       return !value || (typeof value === "object" && !Array.isArray(value));
//     })
//     .nullable()
//     .optional(),

//   // بررسی Optional بودن slug
//   slug: yup
//     .string()
//     .matches(
//       /^[a-zA-Z0-9-]+$/,
//       "Slug can only contain letters, numbers, and hyphens"
//     )
//     .max(50, "Slug must not exceed 50 characters")
//     .nullable()
//     .optional(),
// });

// function isValidObjectId(value) {
//   // فرض می‌کنیم که این تابع بررسی صحت ObjectId رو انجام میده
//   const ObjectId = require("mongodb").ObjectId;
//   return ObjectId.isValid(value);
// }

const updateProductInfoSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name cannot exceed 100 characters"),

  slug: yup
    .string()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),

  description: yup
    .string()
    .max(1000, "Product description cannot exceed 1000 characters"),

  subCategory: yup
    .string()
    .test(
      "is-valid-objectid",
      "SubCategory ID must be a valid ObjectId",
      (value) => value === null || value === undefined || isValidObjectId(value)
    ),

  sellers: yup
    .array()
    .of(
      yup.object().shape({
        id: yup
          .string()
          .required("Seller ID is required")
          .test(
            "is-valid-objectid",
            "Seller ID must be a valid ObjectId",
            isValidObjectId
          ),
        price: yup
          .number()
          .required("Price is required")
          .positive("Price must be a positive number"),
        stock: yup
          .number()
          .required("Stock is required")
          .min(0, "Stock must be a non-negative number"),
      })
    )
    .min(1, "At least one seller is required"),

  customFields: yup
    .object()
    .test(
      "customFieldsCheck",
      "customFields must be an object with key-value pairs",
      (value) => value === undefined || typeof value === "object"
    ),

  filterValues: yup
    .object()
    .test(
      "filterValuesCheck",
      "filterValues must be an object with key-value pairs",
      (value) => value === undefined || typeof value === "object"
    ),
});

module.exports = { createProductSchema, updateProductInfoSchema };
