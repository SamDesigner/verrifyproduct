import { FiUpload } from "react-icons/fi";

const UploadInput = () => {
  return (
    <div className="glass-input flex gap-2 items-center cursor-pointer">
      <FiUpload />
      <input className="w-full" type="file" />
    </div>
  );
};

export default UploadInput;
