export interface Property {
  id: string;
  name: string;
  description: string;
  propertyVerificationStatus: string;
  area: number;
  polygon: GeoJSON.Polygon;
  address: string;
  city: string;
  state: string;
  propertyType: string;
  isSubProperty: boolean;
  users: unknown | null;
}
export interface Company {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  verificationMessage: string;
  phoneNumber?: string;
  companyVerificationStatus: string;
  proofOfAddressType?: string;
  proofOfAddress?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface CreateCompanyPayload {
  name: string;
  description: string;
  phoneNumber: string;
  proofOfAddressType: string;
  proofOfAddress: string;
  profileImage: string;
  address: string;
  city: string;
  state: string;
  isSubmitted: boolean;
}
export interface GetCompanyResponse {
  success: string;
  message: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    name: string;
    description: string;
    verificationMessage: string;
    phoneNumber: string;
    companyVerificationStatus: string;
    proofOfAddressType: string;
    proofOfAddress: string;
    profileImage: string;
    address: string;
    city: string;
    state: string;
  };
  description: string;
}
// types/completeProfile.ts

export interface UpdateCompanyPayload {
  name: string;
  description: string;
  phoneNumber: string;
  proofOfAddressType: string;
  proofOfAddress: string;
  profileImage: string;
  address: string;
  city: string;
  state: string;
  isSubmitted: boolean;
}

export interface UpdateCompanyResponse {
  success: string;
  message: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    name: string;
    description: string;
    verificationMessage: string;
    phoneNumber: string;
    companyVerificationStatus: string;
    proofOfAddressType:string;
    proofOfAddress: string;
    profileImage: string;
    address: string;
    city: string;
    state: string;
  };
  description: string;

}

