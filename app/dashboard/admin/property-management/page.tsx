"use client";
import { useEffect, useState } from "react";
import {
  getProperties,
} from "@/lib/api/property";
  // updatePropertyVerificationStatus,

import { Property } from "@/lib/types/property";
import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import compass from "@/public/images/compass.jpg"
import { BsFillBuildingsFill } from "react-icons/bs";
import Button from "@/app/components/(FormComponents)/Button";
import VerificationStatus from "@/app/components/(global)/VerificationStatus";
import { useRouter } from "next/navigation";

const Page = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const router = useRouter();
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getProperties();
        console.log("Property Res", res);
        setProperties(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  // const handlePropertyUpdate = async (
  //   propertyId: string,
  //   propertyVerificationStatus: "VERIFIED" | "REJECTED"
  // ) => {
  //   setLoading(true);
  //   try {
  //     const res = await updatePropertyVerificationStatus(
  //       propertyId,
  //       propertyVerificationStatus
  //     );
  //     console.log("Update Res", res);
  //     setProperties((prev) =>
  //       prev.map((p) =>
  //         p.propertyId === propertyId
  //           ? { ...p, propertyVerificationStatus: propertyVerificationStatus }
  //           : p
  //       )
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to update property status");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  if (loading) return <p className="text-white">Loading properties...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-900">
      <div className="p-6">


        <div className="grid grid-cols-2 gap-4">
          {properties.map((property) => (
            <div key={property.propertyId} className="bg_glass_glow p-3 flex gap-5 ">
              <div className="w-[150px] shrink-0">
                <Image className="w-full h-full object-cover rounded-xl" src={compass} alt="Compass Image" />

              </div>
              <div className="p-2 w-full">
                <div className="absolute top-0 right-0">
                  <VerificationStatus property={property} />
                </div>  
                <h2 className="text-white font-semibold text-[22px]">
                  {property.name}
                </h2>
                <div className="border-b w-[50px] border-gray-200 my-2 ">
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-white flex items-center gap-2"> <span><FaLocationDot /></span> <span>{property.city}, {property.state}</span></p>
                  <p className="text-white flex items-center gap-2"><span><BsFillBuildingsFill /></span><span>{property.address}</span></p>
                </div>
                <div className="flex w-full justify-end">
                  <div className="pt-5  w-[150px]">
                    <Button onClick={() => router.push(`/dashboard/admin/property-management/${property.propertyId}`)} text="View Property" />
                    {/* {property.propertyVerificationStatus} */}
                  </div>
                </div>
              </div>
            </div>
            // <div
            //   key={property.propertyId}
            //   className="bg-gray-800 p-4 rounded flex  gap-5 relative "
            // >
            //   <div className="">
            //     <Image
            //       className="h-[100px] w-[100px]"
            //       src={Map}
            //       alt="Map Icon"
            //     />
            //   </div>
            //   <div className="flex flex-col gap-5">
            //     <h2 className="text-white font-semibold text-[22px]">
            //       {property.name}
            //     </h2>
            //     <p
            //       className={`${property.propertyVerificationStatus === "VERIFIED"
            //           ? "bg-green-900 text-white"
            //           : "bg-yellow-500 text-black"
            //         }  rounded-full w-fit py-1 px-3 absolute right-3 top-3`}
            //     >
            //       {property.propertyVerificationStatus}
            //     </p>
            //     <div className="grid grid-cols-3 gap-6">
            //       <p className="text-gray-400 flex flex-col ">
            //         <p className="text-white!">Location:</p>
            //         <p>
            //           {property.city}, {property.state}
            //         </p>
            //       </p>
            //       <p className="text-gray-400 flex flex-col">
            //         <p className="text-white!">Property Type:</p>
            //         <p>{property.propertyType}</p>
            //       </p>
            //       <p className="text-gray-400 flex flex-col">
            //         <p className="text-white!">Company:</p>
            //         <p>{property.company.name}</p>
            //       </p>
            //       <div>
            //         <p className="text-white">Property Description</p>
            //         <p className="text-gray-400">{property.description}</p>
            //       </div>
            //       <div>
            //         <p className="text-white">Property Address</p>
            //         <p className="text-gray-400">{property.address}</p>
            //       </div>
            //       <div>
            //         <p className="text-white">Property Coordinates</p>
            //         {/* <div className="text-gray-400">{property.polygon.coordinates.map((data,index)=>( */}
            //         {property.polygon.coordinates.map((data, index) => (
            //           <ul
            //             key={index}
            //             className="list-disc list-inside ml-4 text-gray-400"
            //           >
            //             {data.map(([lat, lng], coordIndex) => (
            //               <li key={coordIndex}>
            //                 [{lat.toFixed(6)}, {lng.toFixed(6)}]
            //               </li>
            //             ))}
            //           </ul>
            //         ))}
            //         {/* </div> */}
            //       </div>
            //     </div>
            //     <div className="flex  w-full">
            //       {property.propertyVerificationStatus !== "VERIFIED" ? (
            //         <div className="flex gap-2">
            //           <div
            //             onClick={() =>
            //               handlePropertyUpdate(property.propertyId, "VERIFIED")
            //             }
            //             className="bg-green-600 text-white rounded-lg text-center cursor-pointer w-[100px] p-2"
            //           >
            //             {loading ? "Processing..." : "Verify"}
            //           </div>
            //           {/* Decline User Company Profile */}

            //           <div
            //             onClick={() =>
            //               handlePropertyUpdate(property.propertyId, "REJECTED")
            //             }
            //             className="bg-red-600 text-white rounded-lg text-center cursor-pointer p-2 w-[100px]"
            //           >
            //             {loading ? "Processing..." : "Reject"}
            //           </div>
            //         </div>
            //       ) : null}
            //     </div>
            //   </div>

            // </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
