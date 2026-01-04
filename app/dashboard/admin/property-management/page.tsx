"use client";
import { useEffect, useState } from "react";
import { getProperties } from "@/lib/api/property";
import { Property } from "@/lib/types/property";
import Image from "next/image";
import Map from "@/public/images/map.png";
import Link from "next/link";
import Button from "@/app/components/(FormComponents)/Button";
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
        setProperties(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  if (loading) return <p className="text-white">Loading properties...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-900">
      <div className="p-6">
        <h1 className="text-white text-2xl font-bold mb-4">Properties</h1>

        <div className="grid grid-cols-2 gap-4">
          {properties.map((property) => (
            <div
              key={property.propertyId}
              className="bg-gray-800 p-4 rounded flex "
            >
              <div className="">
                <Image
                  className="h-[100px] w-[100px]"
                  src={Map}
                  alt="Map Icon"
                />
              </div>
              <div>
                <h2 className="text-white font-semibold text-[22px]">
                  {property.name}
                </h2>

                <p className="text-gray-400">
                  {property.city}, {property.state}
                </p>
           
                <div className="flex justify-end w-full">
                <Link
                  href={`/dashboard/admin/property-management/${property.propertyId}`}
  
                >
                    <Button text="View Property" />
           
                </Link>
                </div>
              </div>
              {/* "propertyId": "string",
        "name": "string",
        "description": "string",
        "propertyVerificationStatus": {},
        "area": 0,
        "polygon": {},
        "address": "string",
        "city": "string",
        "state": "string",
        "propertyType": "string",
        "isSubProperty": true,
        "users": {},
        "company": {} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
