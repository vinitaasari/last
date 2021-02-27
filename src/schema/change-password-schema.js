import * as Yup from "yup";

export const changePasswordSchema = Yup.object({
  old_password: Yup.string().required("Old Password is required"),
  new_password: Yup.string()
    .required("New Password is required")
    .test("len", "Must be atleast 8 characters", (val) =>
      val ? val.length >= 8 : false
    ),
  confirm_password: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("new_password"), null], "Please enter confirm password"),
});
