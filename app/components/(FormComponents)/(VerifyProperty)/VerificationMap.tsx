"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useVerificationStore } from "@/store/useVerificationStore";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function VerificationMap() {
  const { updateField } = useVerificationStore();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [7.0134, 4.8156], // You can change default center
      zoom: 12,
    });

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    mapRef.current.addControl(drawRef.current);

    const handleUpdate = () => {
      const data = drawRef.current?.getAll();

      if (!data || data.features.length === 0) {
        updateField("polygon", null);
        return;
      }

      const feature = data.features[0];

      if (feature.geometry.type !== "Polygon") return;

      const polygon = {
        type: "Polygon",
        coordinates: feature.geometry.coordinates,
      } as GeoJSON.Polygon;

      updateField("polygon", polygon);
    };

    mapRef.current.on("draw.create", handleUpdate);
    mapRef.current.on("draw.update", handleUpdate);
    mapRef.current.on("draw.delete", () => {
      updateField("polygon", null);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [updateField]);

  return (
    <div className="flex flex-col gap-3 h-[500px]">
      <p className="text-gray-300 text-sm">
        Draw the boundary of the property on the map.
      </p>

      <div
        ref={mapContainerRef}
        className="h-full w-full rounded-xl overflow-hidden border border-gray-700"
      />
    </div>
  );
}