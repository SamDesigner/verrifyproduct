import { create } from "zustand";
import { initiateVerification } from "@/lib/api/verification";
import { InitiateVerificationPayload } from "@/lib/types/verification";

interface VerificationState {
  draft: InitiateVerificationPayload;
  loading: boolean;

  updateField: <K extends keyof InitiateVerificationPayload>(
    key: K,
    value: InitiateVerificationPayload[K]
  ) => void;

  addVerificationFile: (url: string) => void;
  resetDraft: () => void;
  submitVerification: () => Promise<any>;
}

const initialDraft: InitiateVerificationPayload = {
  propertyId: undefined,
  name: "",
  description: "",
  polygon: null,
  propertyType: "LAND",
  address: "",
  city: "",
  state: "",
  country: "",
  verificationFiles: [],
};

export const useVerificationStore = create<VerificationState>((set, get) => ({
  draft: initialDraft,
  loading: false,

  updateField: (key, value) =>
    set((state) => ({
      draft: {
        ...state.draft,
        [key]: value,
      },
    })),

  addVerificationFile: (url) =>
    set((state) => ({
      draft: {
        ...state.draft,
        verificationFiles: [...state.draft.verificationFiles, url],
      },
    })),

  resetDraft: () => set({ draft: initialDraft }),

  submitVerification: async () => {
    try {
      set({ loading: true });

      const payload = get().draft;

      const response = await initiateVerification(payload);

      set({
        draft: initialDraft,
        loading: false,
      });
      return response
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));