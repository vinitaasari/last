import * as yup from "yup";

// /^[a-z ,.'-]+$/
const nameRegex = new RegExp(/^[a-z ,.']+$/, "i");

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
});

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "Please enter 6 digit OTP")
    .required("OTP is required"),
});

export const profileSchema = yup.object().shape({
  isSocialMediaLogin: yup.bool(),
  first_name: yup
    .string()
    .required("Please enter first name")
    .matches(
      nameRegex,
      "First name should not contain numbers and special characters"
    ),
  last_name: yup
    .string()
    .required("Please enter last name")
    .matches(
      nameRegex,
      "Last name should not contain numbers and special characters"
    ),
  password: yup.string().when("isSocialMediaLogin", {
    is: true,
    then: yup.string(),
    otherwise: yup
      .string()
      .required("Please enter password")
      .min(8, "Password must contain atleast 8 characters"),
  }),
  confirmPassword: yup.string().when("isSocialMediaLogin", {
    is: true,
    then: yup.string(),
    otherwise: yup
      .string()
      .required("Please enter confirm password")
      .oneOf([yup.ref("password"), null], "Confirm Password must match"),
  }),
  age: yup
    .number()
    .required("Required")
    .min(1, "Please enter valid age")
    .max(999, "Please enter valid age")
    .integer("Plese enter age in years"),
  gender: yup
    .string()
    .required("Please select gender")
    .matches(/(female|male|other)/, { message: "Please select valid gender" }),
});

export const locationSchema = yup.object().shape({
  languages: yup.array().min(1, "Please select at least one language"),
  country: yup.string().required("Please select country"),
  state: yup.mixed().when("country", {
    is: "India",
    then: yup.string().required("Please select state"),
    otherwise: yup.string(),
  }),
  city: yup.mixed().when("state", {
    is: (val) => Boolean(val) === true,
    then: yup.string().required("Please select city"),
    otherwise: yup.string(),
  }),
});
