"use client";
// import { getPropertyById } from "@/lib/api/property";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

const Page = () => {
//   const { id } = useParams<{ id: string }>();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;
//     const fetchProperty = async () => {
//       try {
//         const propertyData = await getPropertyById(id);
//         setProperty(propertyData);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Failed to load property"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProperty();
//   }, [id]);
//   if (loading) {
//     return <p className="text-white">Loading company...</p>;
//   }
//   if (error) {
//     return <p className="text-red-500">{error}</p>;
//   }
//   if (!property) {
//     return <p className="text-gray-400">Property not found</p>;
//   }
  return (
    <div className="bg-gray-900">
      <div>
        {/* <h1>{property.name} Property Detail</h1> */}
      </div>
    </div>
  );
};

export default Page;
