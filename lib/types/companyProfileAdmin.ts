// lib/types/company.ts

// export interface CompanySummary {
//   companyId: string;
//   companyVerificationStatus: string;
//   proofOfAddressType: string;
//   profileImage: Record<string, unknown>;
//   name: string;
// }
export interface CompanySummary {
  companyId: string;
  companyVerificationStatus: string;
  proofOfAddressType: string;
  name: string;
  profileImage?:string | null;
}
export interface PaginatedCompanyResponse {
  data: CompanySummary[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type VerificationStatus = "NOT_VERIFIED" | "PENDING" | "VERIFIED" | "REJECTED"