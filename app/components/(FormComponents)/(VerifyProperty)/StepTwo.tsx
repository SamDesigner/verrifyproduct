import FileUpload from "@/app/components/(FormComponents)/FileUpload";
import { useVerificationStore } from "@/store/useVerificationStore";

export default function StepTwo() {
  const { addVerificationFile } = useVerificationStore();

  return (
    <div className="flex flex-col gap-6">

      <FileUpload
        fileType="CERTIFICATE_OF_OCCUPANCY"
        label="Document 1"
        onUploadSuccess={(data) => {
          addVerificationFile(data.url);
        }}
      />

      <FileUpload
        fileType="CONTRACT_OF_SALE"
        label="Document 2"
        onUploadSuccess={(data) => {
          addVerificationFile(data.url);
        }}
      />

      <FileUpload
        fileType="SURVEY_PLAN"
        label="Document 3"
        onUploadSuccess={(data) => {
          addVerificationFile(data.url);
        }}
      />

    </div>
  );
}