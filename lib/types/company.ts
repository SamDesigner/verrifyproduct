export interface Company {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  verificationMessage: string;
  phoneNumber?:string;
  companyVerificationStatus: string;
  proofOfAddressType?:string;
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
  // isSubmitted:boolean

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
  },
  description: string

}
// types/completeProfile.ts
export interface CompleteProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;

  dob?: string | null;
  profileImageUrl?: string | null;
}

