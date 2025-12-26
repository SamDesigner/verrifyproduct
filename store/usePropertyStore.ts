import { create } from "zustand";
import { createProperty, CreatePropertyPayload } from "@/lib/api/property";

interface PropertyState {
  propertyDraft: CreatePropertyPayload;
  loading: boolean;

  updateDraftField: <K extends keyof CreatePropertyPayload>(
    key: K,
    value: CreatePropertyPayload[K]
  ) => void;

  resetDraft: () => void;
  submitPropertyDraft: () => Promise<void>;
}

const initialDraft: CreatePropertyPayload = {
  name: "",
  description: "",
  polygon: null as GeoJSON.Feature | null,
  propertyType: "LAND",
  address: "",
  city: "",
  state: "",
  certificationOfOccupancy: "",
  contractOfSale: "",
  surveyPlan: "",
  letterOfIntent: "",
  isSubmitted: false,
};

export const usePropertyStore = create<PropertyState>((set, get) => ({
  propertyDraft: initialDraft,
  loading: false,

  updateDraftField: (key, value) =>
    set((state) => ({
      propertyDraft: {
        ...state.propertyDraft,
        [key]: value,
      },
    })),

  resetDraft: () => set({ propertyDraft: initialDraft }),

  submitPropertyDraft: async () => {
    try {
      set({ loading: true });

      const payload: CreatePropertyPayload = {
        ...get().propertyDraft,
        isSubmitted: true,
      };
      const response = await createProperty(payload);

        return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }

    set({ propertyDraft: initialDraft, loading: false });
  },
}));
