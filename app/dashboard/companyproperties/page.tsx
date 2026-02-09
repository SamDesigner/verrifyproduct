

"use client"
import { getCompanyProperties } from "@/lib/api/company"
import { useState, useEffect } from "react"
import { useCompanyStore } from "@/store/useCompanyStore";
import { Property } from '@/lib/types/company';
import map from '@/public/images/map.png'
import Image from 'next/image'
import Button from '@/app/components/(FormComponents)/Button'
const Page = () => {
  const [properties, setProperties] = useState<Property[] | null>([]);
  //   const [error, setError] = useState<string | null>(null);
  //   const { hasCompany, loading } = useCompanyStore(); 
  //   const [fetching, setFetching] = useState(true);
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
      }
    };

    fetchProperties();
  }, []);


  //   if (loading ) {
  //     return <p className="text-white">Loading properties…</p>;
  //   }

  //   if (error) {
  //     return <p className="text-red-500">{error}</p>;
  //   }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties?.map((property) => (
          <div
            key={property.id}
            className="bg-gray-900 rounded-xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <Image className="h-[50px] w-[50px]" alt="Map Image" src={map} />
              <h3 className="font-semibold text-[30px]">{property.name}</h3>
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
              <div>
                <Button text="View Property" />
              </div>
        ))}
            </div>
          </div>
        )
}

        export default Page