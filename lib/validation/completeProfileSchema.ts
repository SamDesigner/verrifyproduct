// lib/validation/completeProfileSchema.ts
import * as yup from "yup";

export const completeProfileSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  address: yup.string().required("Address is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),

  dob: yup.string().nullable().optional(),
  profileImageUrl: yup.string().nullable().optional(),
});
