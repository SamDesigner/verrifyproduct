import * as yup from "yup";

export const companySchema = yup.object({
  name: yup.string().required("Company name is required"),
  description: yup.string().required("Description is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  proofOfAddressType: yup
    .string()
    .oneOf(
      ["CERTIFICATE_OF_OCCUPANCY", "CONTRACT_OF_SALE", "SURVEY_PLAN"],
      "Select a valid proof of address type"
    )
    .required("Proof of Address Type is required"),
  proofOfAddress: yup.string().required("Proof of Address file is required"),
  profileImage: yup.string().required("Profile image is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
});

export const createCompanySchema =  yup.object({
  name: yup.string().required("Company name is required"),
  description: yup.string().required("Description is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+]+$/, "Invalid phone number"),
  proofOfAddressType: yup
    .string()
    .required("Proof of address type is required"),
  profileImage: yup.string().required("Profile image is required"),
  proofOfAddress: yup.string().required("Proof of address file is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
});