"use client"
import { getPropertyById } from "@/lib/api/property"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { SinglePropertyResponse } from "@/lib/types/property";
import VerificationStatus from "@/app/components/(global)/VerificationStatus";
import { IoDocumentSharp } from "react-icons/io5";
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
                console.log('This is the data', response)
                setProperty(response.data);
                console.log('This is Property', property)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id])
    if (loading) return <p className="text-white">Loading...</p>;
    if (!property) return <p>Property not found</p>;
    return (
        <div>
            <div className="py-2">
                <h1 className="text-[40px] font-bold text-white">Property Detail</h1>
            </div>
            <div className="bg-gray-900 rounded-xl p-5">
                <div>
                    <div className="border-b border-white pb-5">
                        <h1 className="text-white text-[30px] font-semibold">{property.name}</h1>
                    </div>
                    <div className="grid grid-cols-3 gap-10 py-5">
                        <div className="flex flex-col  gap-1">
                            <h3 className="font-bold text-white text-[17px]">State </h3>
                            <p className="text-gray-300">{property.state}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-white text-[17px]">City</h3>
                            <p className="text-gray-300">{property.city}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-white text-[17px]">Address</h3>
                            <p className="text-gray-300">{property.address}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-white text-[17px]">Property Status</h3>
                            <VerificationStatus property={property.propertyVerificationStatus} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-white text-[17px]">Property Area</h3>
                            <p className="text-gray-300">{property.area}</p>

                        </div>
                    </div>
                    <div>
                        <div className="py-5">
                            <h3 className="uppercase font-bold text-white">{property.name} Documents</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg_glass_glow text-white flex flex-col items-center justify-center gap-2 p-2">
                                <IoDocumentSharp size={30} />
                                <p className="text-[14px] text-center">Occupancy Certificate</p>
                            </div>
                            <div className="bg_glass_glow text-white flex flex-col items-center justify-center gap-2 p-2">
                                <IoDocumentSharp size={30} />
                                <p className="text-[14px]">Contract of Sale</p>
                            </div>
                            <div className="bg_glass_glow text-white flex flex-col items-center justify-center gap-2 p-2">
                                <IoDocumentSharp size={30} />
                                <p className="text-[14px]">Letter of Intent</p>
                            </div>
                            <div className="bg_glass_glow text-white flex flex-col items-center justify-center gap-2 p-2">
                                <IoDocumentSharp size={30} />
                                <p className="text-[14px]">Survey Plan</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Page