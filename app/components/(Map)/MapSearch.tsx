// "use client";

// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import mapboxgl from "mapbox-gl";
// import { useEffect, useRef } from "react";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// type Props = {
//   onLocationSelect: (locationName: string) => void;
// };

// export default function MapSearch({ onLocationSelect }: Props) {
//   const geocoderRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!geocoderRef.current) return;

//     const geocoder = new MapboxGeocoder({
//       accessToken: mapboxgl.accessToken,
//       mapboxgl,
//     });

//     geocoder.on("result", (e) => {
//       onLocationSelect(e.result.place_name);
//     });

//     geocoderRef.current.appendChild(geocoder.onAdd());

//     return () => {
//       geocoder.onRemove();
//     };
//   }, [onLocationSelect]);

//   return (
//     <div
//       ref={geocoderRef}
//       className="absolute top-4 left-4 z-50 w-96"
//     />
//   );
// }
