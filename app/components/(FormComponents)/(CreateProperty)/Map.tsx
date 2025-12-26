"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Button from "../Button";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/toast/toast";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const { updateDraftField, submitPropertyDraft, loading, propertyDraft } =
    usePropertyStore();
    const router = useRouter()
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [7.0134, 4.8156], // Port Harcourt
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

      if (!data || data.features.length === 0) return;

      const feature = data.features[0];

      if (feature.geometry.type !== "Polygon") return;

      const coordinates = feature.geometry.coordinates;

      updateDraftField("polygon", {
        type: "Polygon",
        coordinates: Array.isArray(coordinates[0][0])
          ? coordinates
          : [coordinates],
      });
    };

    mapRef.current.on("draw.create", handleUpdate);
    mapRef.current.on("draw.update", handleUpdate);
    mapRef.current.on("draw.delete", () => {
      updateDraftField("polygon", null);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [updateDraftField]);

  const handleSubmit = async () => {
    if (
      !propertyDraft.polygon ||
      Object.keys(propertyDraft.polygon).length === 0
    ) {
      alert("Please draw your land boundary on the map");
      return;
    }
    try{
         await submitPropertyDraft();
        toastSuccess('Property created successfully');
        router.push("/dashboard")
    }catch(err){
        console.error('This is the error', err)
    }
  };

  return (
    <div className="flex absolute w-full h-screen left-0 top-0 z-1000  flex-col gap-3">
      <p className="text-white text-sm">
        Draw the boundary of your land on the map
      </p>

      <div
        ref={mapContainerRef}
        className="h-full w-full rounded-xl overflow-hidden border border-gray-700"
      />
      <div>
        <Button
          text={loading ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
}
