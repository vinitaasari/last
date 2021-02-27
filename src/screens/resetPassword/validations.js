import * as yup from "yup";

export const resetSchema = yup.object().shape({
  password: yup
    .string()
    .required("Please enter password")
    .min(8, "Password must contain atleast 8 characters"),

  confirmPassword: yup
    .string()
    .required("Please enter confirm password")
    .oneOf([yup.ref("password"), null], "Confirm Password must match"),
});
