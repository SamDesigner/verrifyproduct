"use client";

import { useVerificationStore } from "@/store/useVerificationStore";

export default function StepOne() {
  const { draft, updateField } = useVerificationStore();

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-2">
        <label className="text-gray-200">Property Name</label>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="glass-input p-3"
          placeholder="Enter property name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-200">Description</label>
        <textarea
          value={draft.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="glass-input p-3"
          placeholder="Enter property description"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-200">Property Type</label>
        <select
          value={draft.propertyType}
          onChange={(e) =>
            updateField("propertyType", e.target.value as "LAND")
          }
          className="glass-input p-3"
        >
          <option value="LAND">Land</option>
        </select>
      </div>
          {/* Address */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-200">Address</label>
        <input
          type="text"
          value={draft.address}
          onChange={(e) => updateField("address", e.target.value)}
          className="glass-input p-3"
          placeholder="Enter property address"
        />
      </div>

      {/* City */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-200">City</label>
        <input
          type="text"
          value={draft.city}
          onChange={(e) => updateField("city", e.target.value)}
          className="glass-input p-3"
          placeholder="Enter city"
        />
      </div>

      {/* State */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-200">State</label>
        <input
          type="text"
          value={draft.state}
          onChange={(e) => updateField("state", e.target.value)}
          className="glass-input p-3"
          placeholder="Enter state"
        />
      </div>

      {/* Country */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-200">Country</label>
        <input
          type="text"
          value={draft.country}
          onChange={(e) => updateField("country", e.target.value)}
          className="glass-input p-3"
          placeholder="Enter country"
        />
      </div>


    </div>
  );
}