export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  dob: string | null;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  lastLogin: string;
  profileImage: string | null;
  hasCompanyProfile: boolean;
  is2fa: boolean;
  isVerified: boolean;
  isGoogleLogin: boolean;
  isEnabled: boolean;
};
// export interface CompleteProfileFormData {
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   address: string;
//   phoneNumber: string;
//   city: string;
//   state: string;

//   dob?: string | null;
//   profileImageUrl?: string | null;
// }

