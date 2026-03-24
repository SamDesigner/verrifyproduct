import FileUpload from "@/app/components/(FormComponents)/FileUpload";
import { useVerificationStore } from "@/store/useVerificationStore";

const documents = [
  { fileType: "VERIFICATION_DOCUMENT", label: "Certificate of Occupancy", description: "Official document confirming legal ownership" },
  { fileType: "VERIFICATION_DOCUMENT",         label: "Contract of Sale",          description: "Signed agreement between buyer and seller" },
  { fileType: "VERIFICATION_DOCUMENT",              label: "Survey Plan",               description: "Technical drawing of the property boundaries" },
];

export default function StepTwo() {
  const { addVerificationFile } = useVerificationStore();

  return (
    <div className="flex flex-col gap-5">
      <p className="text-slate-400 text-sm">
        Upload the required property documents. All files must be clear and legible.
      </p>

      {documents.map(({ fileType, label, description },index) => (
        <div
          key={index}
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold text-slate-200">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
          <FileUpload
            fileType={fileType} 
            label={label}
            onUploadSuccess={(data) => addVerificationFile(data.url)}
          />
        </div>
      ))}
    </div>
  );
}