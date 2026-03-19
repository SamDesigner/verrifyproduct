"use client";
import { useUpdateVerificationStore } from "@/store/useUpdateVerificationStore";

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function UpdateStepOne() {
  const { draft, updateField } = useUpdateVerificationStore();

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = "1px solid rgba(99,102,241,0.5)";
    e.currentTarget.style.background = "rgba(99,102,241,0.04)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Property Name">
        <input type="text" value={draft.name ?? ""} onChange={(e) => updateField("name", e.target.value)}
          onFocus={onFocus} onBlur={onBlur} className={inputClass} style={inputStyle} placeholder="e.g. Lekki Phase 1 Plot" />
      </Field>

      <Field label="Description">
        <textarea value={draft.description ?? ""} onChange={(e) => updateField("description", e.target.value)}
          onFocus={onFocus} onBlur={onBlur} rows={4} className={`${inputClass} resize-none`} style={inputStyle}
          placeholder="Describe the property..." />
      </Field>

      <Field label="Property Type">
        <select value={draft.propertyType ?? "LAND"} onChange={(e) => updateField("propertyType", e.target.value as "LAND")}
          onFocus={onFocus} onBlur={onBlur} className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}>
          <option value="LAND">Land</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Address">
          <input type="text" value={draft.address ?? ""} onChange={(e) => updateField("address", e.target.value)}
            onFocus={onFocus} onBlur={onBlur} className={inputClass} style={inputStyle} placeholder="Street address" />
        </Field>
        <Field label="City">
          <input type="text" value={draft.city ?? ""} onChange={(e) => updateField("city", e.target.value)}
            onFocus={onFocus} onBlur={onBlur} className={inputClass} style={inputStyle} placeholder="City" />
        </Field>
        <Field label="State">
          <input type="text" value={draft.state ?? ""} onChange={(e) => updateField("state", e.target.value)}
            onFocus={onFocus} onBlur={onBlur} className={inputClass} style={inputStyle} placeholder="State" />
        </Field>
        <Field label="Country">
          <input type="text" value={draft.country ?? ""} onChange={(e) => updateField("country", e.target.value)}
            onFocus={onFocus} onBlur={onBlur} className={inputClass} style={inputStyle} placeholder="Country" />
        </Field>
      </div>
    </div>
  );
}