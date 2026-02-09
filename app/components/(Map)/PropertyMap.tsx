"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  getPropertiesByViewport,
  getNearbyProperties,
} from "@/lib/api/property";
import type { Property } from "@/lib/types/property";
import { getPropertiesByLocation } from "@/lib/api/property";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
console.log("Mapbox token:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

export default function PropertyMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [searchMode, setSearchMode] = useState<"viewport" | "location">("viewport");
  const [locationQuery, setLocationQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);


  /* =======================
   Search On Map By Location
======================== */
  const searchByLocation = async (locationName: string) => {
    if (!mapRef.current) return;

    try {
      setSearchMode("location");

      const response = await getPropertiesByLocation({
        locationName,
        limit: 50,
      });

      // const data = response.data;
      const data: Property[] = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      console.log('This is the data from location search', data)
      setProperties(data);
      drawPolygons(mapRef.current, data);
    } catch (err) {
      console.error("Location search failed", err);
    }
  };

  /* =======================
     Draw Polygons
  ======================== */
  const drawPolygons = (map: mapboxgl.Map, properties: Property[]) => {
    // Guard: map style not loaded
    if (!map || !map.isStyleLoaded()) {
      console.warn("Map style not loaded yet");
      return;
    }

    const geoJson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: properties
        .filter((p) => p.polygon) // ignore undefined polygons
        .map((property) => ({
          type: "Feature",
          geometry: property.polygon as GeoJSON.Geometry,
          properties: {
            propertyId: property.propertyId,
            name: property.name,
            status: property.propertyVerificationStatus,
          },
        })),
    };

    const source = map.getSource("properties") as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (source) {
      source.setData(geoJson);
      return;
    }

    map.addSource("properties", {
      type: "geojson",
      data: geoJson,
    });

    map.addLayer({
      id: "property-fill",
      type: "fill",
      source: "properties",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "status"], "VERIFIED"],
          "#22c55e",
          "#eab308",
        ],
        "fill-opacity": 0.45,
      },
    });

    map.addLayer({
      id: "property-outline",
      type: "line",
      source: "properties",
      paint: {
        "line-color": "#ffffff",
        "line-width": 2,
      },
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", "property-fill", (e) => {
      map.getCanvas().style.cursor = "pointer";

      const feature = e.features?.[0];
      if (!feature) return;

      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong>${feature.properties?.name}</strong><br/>
           Status: ${feature.properties?.status}`
        )
        .addTo(map);
    });

    map.on("mouseleave", "property-fill", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  };

  /* =======================
     Fetch Viewport Properties
  ======================== */
  const fetchViewportProperties = async (map: mapboxgl.Map) => {
    if (searchMode === "location") return;
    if (!map.isStyleLoaded()) return;

    try {
      const bounds = map.getBounds();
      if (!bounds) return;
      const data = await getPropertiesByViewport({
        north: bounds.getNorth() ?? 0,
        south: bounds.getSouth() ?? 0,
        east: bounds.getEast() ?? 0,
        west: bounds.getWest() ?? 0,
        zoom: map.getZoom(),
      });
      console.log("The data from endpoint", data);
      setProperties(data);
      drawPolygons(map, data);
    } catch (err) {
      console.error("Viewport fetch failed", err);
    }
  };

  /* =======================
     Initialize Map
  ======================== */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [7.0134, 4.8156], // Port Harcourt
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl());

    mapRef.current = map;

    map.on("load", () => {
      fetchViewportProperties(map);
    });

    map.on("moveend", () => {
      if (!map.isStyleLoaded()) return;
      fetchViewportProperties(map);
    });

    map.on("click", async (e) => {
      try {
        const nearby = await getNearbyProperties({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
          radiusKm: 3,
        });

        setProperties(nearby);
        drawPolygons(map, nearby);
      } catch (err) {
        console.error("Nearby property fetch failed", err);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  },[]);

  /* =======================
     Render
  ======================== */
  return (
    <div className="relative w-full h-screen">
      {/* <div ref={mapContainerRef} className="absolute inset-0" /> */}
      <div className="flex absolute w-full h-screen left-0 top-0 z-1000  flex-col gap-3">
        <div ref={mapContainerRef} style={{ height: "100vh" }} />
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded text-sm">
          Properties loaded: {properties.length}
        </div>
      </div>
      <div className="absolute top-4 left-4  bg-white/70 p-3 rounded flex gap-2 z-1000">
        <input
          type="text"
          placeholder="Search by location (e.g. GRA, Lekki)"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          className="px-3 py-2 text-black rounded w-full md:w-64"
        />
        <button
          onClick={() => searchByLocation(locationQuery)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Search
        </button>
      </div>
    </div>
  );
}
