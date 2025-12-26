"use client";
import { usePropertyStore } from "@/store/usePropertyStore";

const StepOne = () => {
  const { propertyDraft, updateDraftField } = usePropertyStore();
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Property Name</label>
          <input
            placeholder="Property Name"
            value={propertyDraft.name}
            onChange={(e) => updateDraftField("name", e.target.value)}
            className="glass-input"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Description</label>
          <textarea
            placeholder="Description"
            value={propertyDraft.description}
            onChange={(e) => updateDraftField("description", e.target.value)}
            className="glass-input"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Property Type</label>
          <select
            value={propertyDraft.propertyType}
            onChange={(e) =>
              updateDraftField("propertyType", e.target.value as "LAND")
            }
            className="glass-input"
          >
            <option value="LAND">LAND</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Address</label>
          <input
            placeholder="Address"
            value={propertyDraft.address}
            onChange={(e) => updateDraftField("address", e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
    </div>
  );
};

export default StepOne;
