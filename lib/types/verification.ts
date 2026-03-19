export interface InitiateVerificationPayload {
  propertyId?: string; 
  name: string;
  description: string;
  polygon: GeoJSON.Polygon | null;
  propertyType: "LAND";
  address: string;
  city: string;
  state: string;
  country: string;
  verificationFiles: string[]; 
}
// export interface InitiateVerificationResponse{

// }

// For Admin Endpoints
export interface VerificationListParams {
  userId?: string;
  search?: string;
  page?: number;
  order?: "ASC" | "DESC";
  limit?: number;
}

export interface VerificationProperty {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  area: number | null;
  pin: string | null;
  polygon: {
    type: "Polygon";
    coordinates: number[][][];
  };
  propertyType: string;
  propertyVerificationStatus: string;
  isSubProperty: boolean;
  certificationOfOccupancy: string | null;
  contractOfSale: string | null;
  surveyPlan: string | null;
  letterOfIntent: string | null;
  deedOfConveyance: string | null;
  users: null;
}

export interface VerificationUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string | null;
}

export interface StageHistory {
  stage: string;
  completedAt: string;
}

export interface VerificationItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  stage: string;
  caseId: string | null;
  adminComments: string | null;
  adminStageFiles: string[];
  reviewedAt: string | null;
  reviewUser: VerificationUser | null;
  user: VerificationUser;
  property: VerificationProperty;
  verificationFiles: string[];
  stageHistory: unknown[];
}
export interface VerificationDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  stage: string;
  caseId: string | null;
  adminComments: string | null;
  reviewedAt: string | null;
  verificationFiles: string[];
  adminStageFiles: string[];
  property: VerificationProperty;
  user: VerificationUser;
  reviewUser: VerificationUser | null;
  stageHistory: StageHistory[];
}
export interface VerificationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface VerificationListData {
  data: VerificationItem[];
  meta: VerificationMeta;
}

export interface VerificationListResponse {
  success: boolean;
  message: string;
  data: VerificationListData;
  status: number;
}

export interface VerificationDetailResponse {
  success: boolean;
  message: string;
  data: VerificationDetail;
  description?: string;
  status: number;
}
export interface VerificationUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  firstName: string;
  lastName: string ;
  email: string;
  role: string;
  username: string | null;
  dob: string | null;
  phoneNumber: string | null;  // ← add this
  address: string | null;
  city: string | null;
  state: string | null;
  lastLogin: string | null;
  profileImage: string | null;
  is2fa: boolean;
  isVerified: boolean;
  hasCompanyProfile: boolean;
  isGoogleLogin: boolean;
  isEnabled: boolean;
}

export interface AssignVerificationResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

export type VerdictType = "ACCEPTED" | "REJECTED";

export interface VerdictPayload {
  verdict: VerdictType;
  comments: string;
}

export interface VerdictResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

// / ── My Requests ────────────────────────────────────────────────────────────
 
export interface MyRequestProperty {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  area: number | null;
  pin: string | null;
  polygon: {
    type: "Polygon";
    coordinates: number[][][];
  };
  propertyType: string;
  propertyVerificationStatus: string;
  isSubProperty: boolean;
  certificationOfOccupancy: string | null;
  contractOfSale: string | null;
  surveyPlan: string | null;
  letterOfIntent: string | null;
  deedOfConveyance: string | null;
  users: unknown;
}
 
export interface MyRequestItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  stage: string;
  caseId: string | null;
  adminComments: string | null;
  reviewedAt: string | null;
  verificationFiles: string[];
  adminStageFiles: string[];
  property: MyRequestProperty;
  user: unknown;
  reviewUser: unknown;
  stageHistory: StageHistory[];
}
 
export interface MyRequestsMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
 
export interface MyRequestsData {
  data: MyRequestItem[];
  meta: MyRequestsMeta;
}
 
export interface MyRequestsResponse {
  success: boolean;
  message: string;
  data: MyRequestsData;
  status: number;
}

export interface UpdateVerificationPayload {
  propertyId?: string;
  name?: string;
  description?: string;
  polygon?: unknown;
  propertyType?: "LAND";
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  verificationFiles?: string[];
}
 