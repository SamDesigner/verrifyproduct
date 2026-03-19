import FileUpload from "@/app/components/(FormComponents)/FileUpload";
import { useUpdateVerificationStore } from "@/store/useUpdateVerificationStore";

const documents = [
  { fileType: "CERTIFICATE_OF_OCCUPANCY", label: "Certificate of Occupancy", description: "Official document confirming legal ownership" },
  { fileType: "CONTRACT_OF_SALE",         label: "Contract of Sale",          description: "Signed agreement between buyer and seller" },
  { fileType: "SURVEY_PLAN",              label: "Survey Plan",               description: "Technical drawing of the property boundaries" },
];

export default function UpdateStepTwo() {
  const { addVerificationFile } = useUpdateVerificationStore();

  return (
    <div className="flex flex-col gap-5">
      <p className="text-slate-400 text-sm">
        Upload updated documents if needed. Previously uploaded files are already saved.
      </p>
      {documents.map(({ fileType, label, description }) => (
        <div key={fileType} className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
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