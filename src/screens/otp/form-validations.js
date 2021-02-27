import * as yup from "yup";

export const otpSchema = yup.object().shape({
  otp: yup.string().length(6, "Please enter 6 digit otp").required("Required!"),
});