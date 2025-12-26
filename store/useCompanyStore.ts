import { create } from "zustand";
import { Company, CreateCompanyPayload } from "@/lib/types/company";
import { getCompany, createCompany } from "@/lib/api/company";

interface CompanyState {
 
  company: Company | null;
  hasCompany: boolean;
  loading: boolean;

  // 🔹 NEW: Draft state for form
  companyDraft: CreateCompanyPayload;

  // Actions
  fetchCompany: () => Promise<void>;
  clearCompany: () => void;

  // Draft helpers
  updateDraftField: <K extends keyof CreateCompanyPayload>(
    key: K,
    value: CreateCompanyPayload[K]
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
  isSubmitted:false
 
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  // 🔹 Existing state
  company: null,
  hasCompany: false,
  loading: false,

  // 🔹 Draft state
  companyDraft: initialDraft,

  // 🔹 Existing logic (UNCHANGED)
  fetchCompany: async () => {
    set({ loading: true });
    try {
      const company = await getCompany();
      set({
        company,
        hasCompany: Boolean(company),
        loading: false,
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
    });
  },

  // 🔹 Draft field updater
  updateDraftField: (key, value) =>
    set((state) => ({
      companyDraft: {
        ...state.companyDraft,
        [key]: value,
      },
    })),

  resetDraft: () => set({ companyDraft: initialDraft }),

  // 🔹 FINAL submit (inject isSubmitted here)
  submitCompanyDraft: async () => {
    const payload: CreateCompanyPayload = {
      ...get().companyDraft,
      isSubmitted: true, 
    };

    const response = await createCompany(payload);

    // Optional: refresh company from backend
    await get().fetchCompany();

    set({
      companyDraft: initialDraft,
    });

    return response;
  },
}));
