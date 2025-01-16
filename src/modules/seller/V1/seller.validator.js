const yup = require("yup");

const createSellerSchema = yup.object().shape({
  storeName: yup
    .string()
    .min(4, "Store name must be at least 4 characters long")
    .max(15, "Store name cannot be longer than 15 characters")
    .required("Store name is required"),

  contactDetails: yup.object().shape({
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^[0-9]{10,15}$/,
        "Phone number must be between 10 and 15 digits and numeric only"
      ),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format"),
  }),
  location: yup.object().shape({
    lat: yup
      .number()
      .required("Latitude is required")
      .min(-90)
      .max(90)
      .typeError("Latitude must be a number"),
    lng: yup
      .number()
      .required("Longitude is required")
      .min(-180)
      .max(180)
      .typeError("Longitude must be a number"),
  }),

  provincesID: yup
    .number()
    .positive()
    .integer()
    .min(1, "Province ID must be at least 1")
    .max(31, "Province ID cannot be greater than 31")
    .required("Province ID is required"),

  cityID: yup
    .number()
    .positive()
    .integer()
    .min(1, "City ID must be at least 1")
    .max(1160, "City ID cannot be greater than 1160")
    .required("City ID is required"),

  physicalAddress: yup
    .string()
    .min(15, "Physical address must be at least 15 characters long")
    .required("Physical address is required"),
});

const updateInfoSellerSchema = yup.object().shape({
  storeName: yup
    .string()
    .min(4, "Store name must be at least 4 characters long")
    .max(15, "Store name cannot be longer than 15 characters"),
  contactDetails: yup.object().shape({
    phone: yup
      .string()
      .matches(
        /^[0-9]{10,15}$/,
        "Phone number must be between 10 and 15 digits and numeric only"
      ),
    email: yup.string().email("Invalid email format"),
  }),
  location: yup.object().shape({
    lat: yup.number().min(-90).max(90).typeError("Latitude must be a number"),
    lng: yup
      .number()
      .min(-180)
      .max(180)
      .typeError("Longitude must be a number"),
  }),

  provincesID: yup
    .number()
    .positive()
    .integer()
    .min(1, "Province ID must be at least 1")
    .max(31, "Province ID cannot be greater than 31"),
  cityID: yup
    .number()
    .positive()
    .integer()
    .min(1, "City ID must be at least 1")
    .max(1160, "City ID cannot be greater than 1160"),
  physicalAddress: yup
    .string()
    .min(15, "Physical address must be at least 15 characters long"),
});

module.exports = { createSellerSchema, updateInfoSellerSchema };
