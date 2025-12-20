import * as yup from "yup";

export const completeProfileSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email().required("Email is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  dob: yup.date().required("Date of Birth is required"),
  profileImageUrl: yup.string().url().required("Profile Image URL is required"),
});
