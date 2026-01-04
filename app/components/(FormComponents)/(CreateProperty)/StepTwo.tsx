"use client";
// import UploadInput from "../UploadInput";
import FileUpload from "@/app/components/(FormComponents)/FileUpload";
import { usePropertyStore } from "@/store/usePropertyStore";
import { FileUploadResponse } from "@/lib/api/file";
const StepTwo = () => {
  const { propertyDraft, updateDraftField } = usePropertyStore();
  const handleUpload =
    (key: keyof typeof propertyDraft) => (file: FileUploadResponse) => {
      updateDraftField(key, file.url);
    };
  return (
    <div>
      <div className="flex flex-col gap-8 ">
    

        <div className="flex flex-col gap-2">
          
          <FileUpload
            fileType="CERTIFICATE_OF_OCCUPANCY"
            label="Certification of Occupancy"
            onUploadSuccess={handleUpload("certificationOfOccupancy")}
            allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
          />
        </div>
        <div className="flex flex-col gap-2">
    
          <FileUpload
            fileType="CONTRACT_OF_SALE"
            label="Contract of Sale"
            onUploadSuccess={handleUpload("contractOfSale")}
            allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
          />
        </div>
        <div className="flex flex-col gap-2">
       
          <FileUpload
            fileType="SURVEY_PLAN"
            label="Survey Plan"
            onUploadSuccess={handleUpload("surveyPlan")}
            allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
          />
        </div>
        <div className="flex flex-col gap-2">
      
          <FileUpload
            fileType="LETTER_OF_INTENT"
            label="Letter of Intent"
            onUploadSuccess={handleUpload("letterOfIntent")}
            allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
          />
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
