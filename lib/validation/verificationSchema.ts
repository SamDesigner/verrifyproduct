import * as yup from "yup";

export const propertyVerificationSchema = yup.object({
  propertyId: yup
    .string()
    .required("Property ID is required"),
  
  name: yup
    .string()
    .required("Property Name is required")
    .min(3, "Property Name must be at least 3 characters"),
  
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  
  propertyType: yup
    .string()
    .required("Property Type is required")
    .oneOf(["LAND"], "Property Type must be LAND"),
  
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  
  city: yup
    .string()
    .required("City is required"),
  
  state: yup
    .string()
    .required("State is required"),
  
  country: yup
    .string()
    .required("Country is required"),
  
  polygon: yup
    .object()
    .nullable()
    .required("Polygon is required"),
  
  verificationFiles: yup
    .array()
    .of(yup.string())
    .required("At least one verification file is required")
    .min(1, "At least one verification file is required"),
});
