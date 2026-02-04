"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MiniMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [7.0134, 4.8156], // Port Harcourt [lng, lat]
      zoom: 11,
      interactive: false, // acts like a preview
    });

    map.on("click", () => {
      router.push("/dashboard/properties");
    });

    return () => map.remove();
  }, [router]);

  return (
    <div
      ref={mapContainer}
      className="h-[300px] w-full rounded-xl cursor-pointer"
    />
  );
}
