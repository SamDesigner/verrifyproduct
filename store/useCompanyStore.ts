import { create } from "zustand";
import { Company, CreateCompanyPayload } from "@/lib/types/company";
import { getCompany, createCompany } from "@/lib/api/company";

interface CompanyState {
  company: Company | null;
  hasCompany: boolean;
  loading: boolean;
  companyId: string | null;

  companyDraft: CreateCompanyPayload;

  fetchCompany: () => Promise<void>;
  clearCompany: () => void;


  updateDraftField: <K extends keyof CreateCompanyPayload>(
    key: K,
    value: CreateCompanyPayload[K],
  ) => void;

  resetDraft: () => void;
  submitCompanyDraft: () => Promise<void>;
}

const initialDraft: CreateCompanyPayload = {
  name: "",
  description: "",
  phoneNumber: "",
  proofOfAddressType: "",
  proofOfAddress: "",
  profileImage: "",
  address: "",
  city: "",
  state: "",
  isSubmitted: false,
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  
  company: null,
  hasCompany: false,
  loading: false,
  companyId: null,

  companyDraft: initialDraft,

  
  fetchCompany: async () => {
    set({ loading: true });
    try {
      const company = await getCompany();
      set({
        company,
        hasCompany: Boolean(company),
        loading: false,
        companyId: company ? company.id : null,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  clearCompany: () => {
    set({
      company: null,
      hasCompany: false,
       companyId: null,
    });
  },

  
  updateDraftField: (key, value) =>
    set((state) => ({
      companyDraft: {
        ...state.companyDraft,
        [key]: value,
      },
    })),

  resetDraft: () => set({ companyDraft: initialDraft }),


  submitCompanyDraft: async () => {
    const payload: CreateCompanyPayload = {
      ...get().companyDraft,
      isSubmitted: true,
    };

    const response = await createCompany(payload);

    await get().fetchCompany();

    set({
      companyDraft: initialDraft,
    });

    return response;
  },
}));
