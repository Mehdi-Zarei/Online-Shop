const Yup = require("yup");

const addressSchema = Yup.object().shape({
  addressName: Yup.string()
    .min(4, "Address name must be at least 4 characters long")
    .max(15, "Address name cannot be longer than 15 characters")
    .required("Address name is required"),

  postalCode: Yup.string()
    .matches(
      /^\d{10}$/,
      "Postal code must be exactly 10 digits and contain only numbers"
    )
    .required("Postal code is required"),

  location: Yup.object().shape({
    lat: Yup.number()
      .required("Latitude is required")
      .min(-90)
      .max(90)
      .typeError("Latitude must be a number"),
    lng: Yup.number()
      .required("Longitude is required")
      .min(-180)
      .max(180)
      .typeError("Longitude must be a number"),
  }),

  provincesID: Yup.number()
    .positive()
    .integer()
    .min(1, "Province ID must be at least 1")
    .max(31, "Province ID cannot be greater than 31")
    .required("Province ID is required"),

  cityID: Yup.number()
    .positive()
    .integer()
    .min(1, "City ID must be at least 1")
    .max(1160, "City ID cannot be greater than 1160")
    .required("City ID is required"),

  physicalAddress: Yup.string()
    .min(15, "Physical address must be at least 15 characters long")
    .required("Physical address is required"),
});

const updateAddressSchema = Yup.object({
  addressName: Yup.string()
    .min(4, "Address name must be at least 4 characters long")
    .max(15, "Address name cannot be longer than 15 characters"),
  postalCode: Yup.string().matches(
    /^\d{10}$/,
    "Postal code must be exactly 10 digits and contain only numbers"
  ),

  location: Yup.object().shape({
    lat: Yup.number()

      .min(-90)
      .max(90)
      .typeError("Latitude must be a number"),
    lng: Yup.number()

      .min(-180)
      .max(180)
      .typeError("Longitude must be a number"),
  }),

  provincesID: Yup.number()
    .positive()
    .integer()
    .min(1, "Province ID must be at least 1")
    .max(31, "Province ID cannot be greater than 31"),

  cityID: Yup.number()
    .positive()
    .integer()
    .min(1, "City ID must be at least 1")
    .max(1160, "City ID cannot be greater than 1160"),
  physicalAddress: Yup.string().min(
    15,
    "Physical address must be at least 15 characters long"
  ),
});

module.exports = { addressSchema, updateAddressSchema };
