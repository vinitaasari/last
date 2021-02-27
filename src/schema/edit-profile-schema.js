import * as Yup from "yup";

const nameRegex = new RegExp(/^[a-z ,.']+$/, "i");

export const editProfileSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required")
    .matches(
      nameRegex,
      "First name should not contain numbers and special characters"
    ),
  last_name: Yup.string()
    .required("Last name is required")
    .matches(
      nameRegex,
      "Last name should not contain numbers and special characters"
    ),
  age: Yup.number()
    .required("Required")
    .min(1, "Please enter valid age")
    .max(100, "Please enter valid age")
    .integer("Plese enter age in years"),
});
