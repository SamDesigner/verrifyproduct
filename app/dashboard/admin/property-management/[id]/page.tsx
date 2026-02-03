"use client";
import { getPropertyById } from "@/lib/api/property";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { Property } from "@/lib/types/property";
import { SinglePropertyResponse } from "@/lib/types/property";
const Page = () => {
  const [property, setProperty] = useState<SinglePropertyResponse | null>(null);
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const id = params.id as string;
  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const response = await getPropertyById(id);
        console.log('This is the data',response)
        setProperty(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id])
  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found</p>;
  return (
    <div className="bg-gray-900">
      <div>
        <h1>{property.name} Property Detail</h1>
      </div>
    </div>
  );
};

export default Page;
