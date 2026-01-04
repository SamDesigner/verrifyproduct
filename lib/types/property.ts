export interface Property {
  propertyId: string;
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
  company :{
    companyId:string;
    companyVerificationStatus:string;
    name:string;
    profileImage:string;
    proofofAddressType:string;
  };
}

export interface PropertyMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface GetPropertiesResponse {
  data: Property[];
  meta: PropertyMeta;
}
export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface PropertyListResponse {
  success: boolean;
  message: string;
  data: {
    data: Property[];
    meta: PaginationMeta;
  };
  status: number;
}
export interface propertyIdResponse{
  name: string;
  description: string;
  polygon: unknown;
  address: string;
  city: string;
  state: string;
  propertyType: string;
  certificationOfOccupancy: string;
  contractOfSale: string;
  surveyPlan: string;
  letterOfIntent: string;
  isSubmitted: boolean;
  deedOfConveyance: string;
  users: [
    string
  ]
}

