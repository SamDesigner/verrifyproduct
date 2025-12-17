import UploadInput from "../UploadInput";

const StepTwo = () => {
  return (
    <div>
      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">City</label>
          <input type="text" className="glass-input" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">
            Certificate of Occupancy
          </label>
          <UploadInput />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Contract of Sales</label>
          <UploadInput />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Letter of Intent</label>
          <UploadInput />
        </div>
      </form>
    </div>
  );
};

export default StepTwo;
