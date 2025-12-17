import clippedImage from "@/public/images/clippedProperty.png";
import Image from "next/image";
import StepTwo from "@/app/components/(FormComponents)/(CreateProperty)/StepTwo";
import Button from "@/app/components/(FormComponents)/Button";
const properties = () => {
  return (
    <div className="p-5 bg-gray-900">
      <div className="flex h-screen ">
        <div className="flex-1 h-full">
          <Image
            className="h-full object-cover image_clip rounded-xl "
            src={clippedImage}
            alt="Property Image"
          />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-white text-[40px] font-semibold">
              Register Land Property
            </h1>
          </div>
        <StepTwo />
        <div className="flex gap-5 mt-5">
          <Button text="Save draft" type="outline"/>
          <Button text="Submit" />
        </div>
        </div>
      </div>
    </div>
  );
};

export default properties;
