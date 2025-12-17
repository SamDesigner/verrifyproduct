import React from "react";

const StepOne = () => {
  return (
    <div>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Name of owner</label>
          <input type="text" className="glass-input" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Property Type</label>
          <select className="glass-input">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">Address</label>
          <input type="text" className="glass-input" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[18px]">State</label>
          <select className="glass-input">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default StepOne;
