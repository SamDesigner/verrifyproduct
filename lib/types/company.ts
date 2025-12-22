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
