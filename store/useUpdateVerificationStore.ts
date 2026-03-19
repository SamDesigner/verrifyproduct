import { create } from "zustand";

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

interface UpdateVerificationState {
  draft: UpdateVerificationPayload;
  loading: boolean;
  initializeDraft: (data: UpdateVerificationPayload) => void;
  updateField: <K extends keyof UpdateVerificationPayload>(
    key: K,
    value: UpdateVerificationPayload[K]
  ) => void;
  addVerificationFile: (url: string) => void;
  resetDraft: () => void;
}

const emptyDraft: UpdateVerificationPayload = {
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

export const useUpdateVerificationStore = create<UpdateVerificationState>((set) => ({
  draft: emptyDraft,
  loading: false,

  initializeDraft: (data) =>
    set({ draft: { ...emptyDraft, ...data } }),

  updateField: (key, value) =>
    set((state) => ({
      draft: { ...state.draft, [key]: value },
    })),

  addVerificationFile: (url) =>
    set((state) => ({
      draft: {
        ...state.draft,
        verificationFiles: [...(state.draft.verificationFiles ?? []), url],
      },
    })),

  resetDraft: () => set({ draft: emptyDraft }),
}));