// resetPassword.schema.ts
import * as yup from "yup";

export const updatePasswordSchema = yup.object({
  oldPassword: yup
    .string()
     .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});
