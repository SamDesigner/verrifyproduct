import React from "react";
import Image from "next/image";
const page = () => {
  return (
    <div className="flex gap-5">
      <div className="flex-1 bg-gray-900 p-3 rounded-xl">
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <img
              className="rounded-full h-[200px] w-[200px] object-cover"
              src="https://img.freepik.com/free-photo/smiley-african-woman-with-golden-earrings_23-2148747979.jpg?t=st=1765833421~exp=1765837021~hmac=119937ee4892164ba9a71ff28e0be6deeea229e227fca666bcf8ea64c3a7fbaa&w=1480"
              alt="Potrait"
            />
          </div>
          <h3 className="text-center text-white text-semibold">Gideon John</h3>
        </div>
      </div>
      <div className="flex-3 bg-gray-900"></div>
    </div>
  );
};

export default page;
