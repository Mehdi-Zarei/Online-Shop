const yup = require("yup");

const phoneNumberSchema = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required.")
    .matches(/^09\d{9}$/, "Phone number must be in the format: 09xxxxxxxxx.")
    .length(11, "Phone number must be exactly 11 digits long."),
});

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.") // Field is mandatory
    .min(2, "Name must be at least 2 characters long.") // Minimum length
    .max(50, "Name cannot exceed 50 characters."), // Maximum length
  phone: yup
    .string()
    .required("Phone number is required.")
    .matches(/^09\d{9}$/, "Phone number must be in the format: 09xxxxxxxxx.")
    .length(11, "Phone number must be exactly 11 digits long."),
  email: yup
    .string()
    .required("Email is required.") // Field is mandatory
    .email("Invalid email format."), // Must follow valid email format
  password: yup
    .string()
    .required("Password is required.") // Field is mandatory
    .min(8, "Password must be at least 8 characters long.") // Minimum length
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ), // Regex to enforce strong password rules
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "confirmPassword must be equal to the password value."
    )
    .required(),
  otp: yup
    .string()
    .required("Otp code is required.")
    .min(5, "Otp Code Must be 5 characters")
    .max(5, "Otp Code Must be 5 characters"),
});

const loginSchema = yup.object().shape({
  identifier: yup
    .string()
    .required("Identifier is required.")
    .test(
      "is-email-or-phone",
      "Identifier must be a valid email or phone number.",
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phoneRegex = /^(\+98|0)?9\d{9}$/;

        return emailRegex.test(value) || phoneRegex.test(value);
      }
    ),
  password: yup
    .string()
    .required("Password is required.") // Field is mandatory
    .min(8, "Password must be at least 8 characters long.") // Minimum length
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ), // Regex to enforce strong password rules
});

module.exports = { phoneNumberSchema, registerSchema, loginSchema };
