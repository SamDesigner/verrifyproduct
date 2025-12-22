import { create } from "zustand";
import { Company } from "@/lib/types/company";
import { getCompany } from "@/lib/api/company";

interface CompanyState {
  company: Company | null;
  hasCompany: boolean;
  loading: boolean;

  fetchCompany: () => Promise<void>;
  clearCompany: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  hasCompany: false,
  loading: false,

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
}));
