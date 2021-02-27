import * as yup from "yup";

export const loginSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must contain atleast 8 characters"),
  // email: yup
  //   .string()
  //   .email("Please enter valid email!")
  //   .required("Email is required"),
});
