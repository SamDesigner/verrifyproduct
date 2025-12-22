import { useState } from "react";
import { toastError, toastSuccess } from "@/lib/toast/toast";
import { uploadFile, FileUploadResponse } from "@/lib/api/file";

interface FileUploadProps {
  fileType: string;
  label?: string;
  onUploadSuccess: (fileData: FileUploadResponse) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export default function FileUpload({
  fileType,
  label = "Upload File",
  onUploadSuccess,
  allowedTypes = ["image/jpeg", "image/png"],
  maxSizeMB = 5,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toastError("File type not allowed");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toastError(`File size exceeds ${maxSizeMB} MB`);
      return;
    }

    setLoading(true);

    try {
      const fileData = await uploadFile(file, fileType);
      toastSuccess("File uploaded successfully!");
      onUploadSuccess(fileData); 
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-200">{label}</label>
      <input
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileChange}
        disabled={loading}
        className="glass-input p-2"
      />
      {loading && <p className="text-gray-300">Uploading...</p>}
    </div>
  );
}
