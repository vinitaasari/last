import * as Yup from "yup";

export const reportIssueSchema = Yup.object({
  subject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Description is required"),
});
