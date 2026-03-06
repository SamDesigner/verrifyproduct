

"use client"
import { getCompanyProperties } from "@/lib/api/company"
import { useState, useEffect } from "react"
import { useCompanyStore } from "@/store/useCompanyStore";
import { Property } from '@/lib/types/company';
import map from '@/public/images/map.png'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import VerificationStatus from "@/app/components/(global)/VerificationStatus";
import Button from '@/app/components/(FormComponents)/Button'
const Page = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter()
  //   const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    //     // if (!hasCompany) {
    //     //   setFetching(false);
    //     //   return;
    //     // }

    const fetchProperties = async () => {
      let { companyId } = useCompanyStore.getState();
      if (!companyId) {
        await useCompanyStore.getState().fetchCompany();
        companyId = useCompanyStore.getState().company?.id;
        // hasCompany = useCompanyStore.getState().hasCompany;
      }

      try {
        const data = await getCompanyProperties();
        setProperties(data.data);
      } catch (err) {
        //         // setError(err);
        console.log("Error fetching properties:", err);
      }finally{
        setLoading(false)
      }
    };

    fetchProperties();
  }, []);


    if (loading ) {
      return <p className="text-white">Loading properties…</p>;
    }

  //   if (error) {
  //     return <p className="text-red-500">{error}</p>;
  //   }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties?.map((property) => (
          <div
            key={property.id}
            className="bg-gray-900 rounded-xl relative p-4 text-white"
          >
            <div className="flex items-center gap-3 mt-6">
              <Image className="h-[50px] w-[50px]" alt="Map Image" src={map} />
              <h3 className="font-semibold text-[30px]">{property.name}</h3>
            </div>
            <div className="absolute right-0 top-0">
              <VerificationStatus property={property.propertyVerificationStatus} />
            </div>
            <p className="text-gray-400 flex flex-col font-semibold mt-5">
              <span className="text-white">Description</span>
              <span>{property.description}</span>
            </p>
            <p className=" text-gray-400 font-semibold flex flex-col">
              <span className="text-white">State: </span>
              <span>{property.state}</span>
            </p>
            <p className=" text-gray-400 font-semibold flex flex-col">
              <span className="text-white">Address: </span>
              <span>{property.address}</span>
            </p>
            <div>
              <div className="mt-5">
                <Button onClick={() =>  router.push(`/dashboard/companyproperties/${property.id}`)} text="View Property" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Page