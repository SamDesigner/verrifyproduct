"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getPropertiesByViewport,
  getNearbyProperties,
  getPropertiesByLocation,
} from "@/lib/api/property";
import type { Property } from "@/lib/types/property";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// ── Map styles ─────────────────────────────────────────────────────────────

const MAP_STYLES = [
  {
    id: "satellite-streets",
    label: "Satellite",
    url: "mapbox://styles/mapbox/satellite-streets-v12",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
  },
  {
    id: "dark",
    label: "Dark",
    url: "mapbox://styles/mapbox/dark-v11",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  },
  {
    id: "streets",
    label: "Streets",
    url: "mapbox://styles/mapbox/streets-v12",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "light",
    label: "Light",
    url: "mapbox://styles/mapbox/light-v11",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    id: "outdoors",
    label: "Outdoors",
    url: "mapbox://styles/mapbox/outdoors-v12",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

// ── Floating control button ────────────────────────────────────────────────

function MapButton({ onClick, title, children, active }: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150"
      style={{
        background: active ? "rgba(99,102,241,0.25)" : "rgba(10,12,20,0.82)",
        backdropFilter: "blur(14px)",
        border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.12)",
        color: active ? "#818cf8" : "#94a3b8",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      onMouseLeave={(e) => !active && (e.currentTarget.style.background = "rgba(10,12,20,0.82)")}
    >
      {children}
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function PropertyMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [searchMode, setSearchMode] = useState<"viewport" | "location">("viewport");
  const [locationQuery, setLocationQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeStyle, setActiveStyle] = useState("satellite-streets");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [isStyleLoading, setIsStyleLoading] = useState(false);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [searching, setSearching] = useState(false);

  // ── Draw polygons ────────────────────────────────────────────────────────
  const drawPolygons = useCallback((map: mapboxgl.Map, props: Property[]) => {
    if (!map || !map.isStyleLoaded()) return;

    const geoJson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: props
        .filter((p) => p.polygon)
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

    const source = map.getSource("properties") as mapboxgl.GeoJSONSource | undefined;
    if (source) { source.setData(geoJson); return; }

    map.addSource("properties", { type: "geojson", data: geoJson });

    map.addLayer({
      id: "property-fill",
      type: "fill",
      source: "properties",
      paint: {
        "fill-color": ["case", ["==", ["get", "status"], "VERIFIED"], "#22c55e", "#f59e0b"],
        "fill-opacity": 0.4,
      },
    });

    map.addLayer({
      id: "property-outline",
      type: "line",
      source: "properties",
      paint: { "line-color": "#ffffff", "line-width": 1.5 },
    });

    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

    map.on("mouseenter", "property-fill", (e) => {
      map.getCanvas().style.cursor = "pointer";
      const feature = e.features?.[0];
      if (!feature) return;
      popup.setLngLat(e.lngLat).setHTML(`
        <div style="font-family:system-ui;padding:4px 2px">
          <strong style="color:#fff;font-size:13px">${feature.properties?.name}</strong>
          <br/>
          <span style="color:#94a3b8;font-size:11px">Status: ${feature.properties?.status}</span>
        </div>
      `).addTo(map);
    });

    map.on("mouseleave", "property-fill", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  }, []);

  // ── Fetch viewport properties ────────────────────────────────────────────
  const fetchViewportProperties = useCallback(async (map: mapboxgl.Map) => {
    if (searchMode === "location") return;
    if (!map.isStyleLoaded()) return;
    try {
      const bounds = map.getBounds();
      if (!bounds) return;
      const data = await getPropertiesByViewport({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
        zoom: map.getZoom(),
      });
      setProperties(data);
      setPropertiesCount(data.length);
      drawPolygons(map, data);
    } catch (err) {
      console.error("Viewport fetch failed", err);
    }
  }, [searchMode, drawPolygons]);

  // ── Search by location ───────────────────────────────────────────────────
  const searchByLocation = async () => {
    if (!mapRef.current || !locationQuery.trim()) return;
    setSearching(true);
    try {
      setSearchMode("location");
      const response = await getPropertiesByLocation({ locationName: locationQuery, limit: 50 });
      const data: Property[] = Array.isArray(response.data?.data) ? response.data.data : [];
      setProperties(data);
      setPropertiesCount(data.length);
      drawPolygons(mapRef.current, data);
    } catch (err) {
      console.error("Location search failed", err);
    } finally {
      setSearching(false);
    }
  };

  // ── Change map style ─────────────────────────────────────────────────────
  const changeStyle = (styleId: string) => {
    const style = MAP_STYLES.find((s) => s.id === styleId);
    if (!style || !mapRef.current || isStyleLoading) return;
    setIsStyleLoading(true);
    setActiveStyle(styleId);
    setStyleDropdownOpen(false);
    mapRef.current.setStyle(style.url);
    mapRef.current.once("styledata", () => {
      if (mapRef.current) drawPolygons(mapRef.current, properties);
      setIsStyleLoading(false);
    });
  };

  // ── Toggle fullscreen ────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => mapRef.current?.resize(), 300);
  };

  // ── Initialize map ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [7.0134, 4.8156],
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");
    map.addControl(new mapboxgl.ScaleControl(), "bottom-left");
    mapRef.current = map;

    map.on("load", () => fetchViewportProperties(map));
    map.on("moveend", () => fetchViewportProperties(map));
    map.on("click", async (e) => {
      try {
        const nearby = await getNearbyProperties({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
          radiusKm: 3,
        });
        setProperties(nearby);
        setPropertiesCount(nearby.length);
        drawPolygons(map, nearby);
      } catch (err) {
        console.error("Nearby fetch failed", err);
      }
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [fetchViewportProperties, drawPolygons]);

  // Close style dropdown on outside click
  useEffect(() => {
    const handler = () => setStyleDropdownOpen(false);
    if (styleDropdownOpen) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [styleDropdownOpen]);

  const activeStyleObj = MAP_STYLES.find((s) => s.id === activeStyle);

  return (
    <>
      <style>{`
        .mapboxgl-map { position: absolute !important; inset: 0; width: 100% !important; height: 100% !important; }
        .mapboxgl-canvas { width: 100% !important; height: 100% !important; }
        .mapboxgl-popup-content { background: rgba(10,12,20,0.92) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 10px !important; padding: 10px 14px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; backdrop-filter: blur(12px) !important; }
        .mapboxgl-popup-tip { display: none !important; }
      `}</style>

      <div
        className="transition-all duration-300"
        style={{
          position: isFullscreen ? "fixed" : "relative",
          inset: isFullscreen ? 0 : "auto",
          zIndex: isFullscreen ? 9999 : "auto",
          width: "100%",
          height: isFullscreen ? "100vh" : "calc(100vh - 80px)",
          minHeight: 400,
          background: "#0f1117",
        }}
      >
        {/* Map canvas */}
        <div ref={mapContainerRef} style={{ position: "absolute", inset: 0 }} />

        {/* ── Top controls bar ── */}
        <div style={{ position: "absolute", top: 16, left: 16, right: 16, zIndex: 10, display: "flex", alignItems: "center", gap: 10 }}>

          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 max-w-sm px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(10,12,20,0.82)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search location (e.g. GRA, Lekki)..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchByLocation()}
              className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none"
            />
            {locationQuery && (
              <button onClick={() => { setLocationQuery(""); setSearchMode("viewport"); }}
                className="text-slate-600 hover:text-slate-400 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={searchByLocation}
            disabled={searching || !locationQuery.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background: searching ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.2)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: searching ? "#4338ca" : "#818cf8",
              cursor: searching || !locationQuery.trim() ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            {searching ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            )}
            Search
          </button>

          {/* Map style dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
              style={{
                background: "rgba(10,12,20,0.82)",
                backdropFilter: "blur(14px)",
                border: styleDropdownOpen ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.12)",
                color: "#94a3b8",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              <span style={{ color: "#818cf8" }}>{activeStyleObj?.icon}</span>
              <span className="hidden sm:inline text-xs">{activeStyleObj?.label}</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: styleDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown */}
            {styleDropdownOpen && (
              <div
                className="absolute top-12 right-0 rounded-xl overflow-hidden py-1"
                style={{
                  background: "rgba(10,12,20,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                  minWidth: 160,
                  zIndex: 100,
                }}
              >
                {MAP_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => changeStyle(style.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors duration-150 text-left"
                    style={{
                      background: activeStyle === style.id ? "rgba(99,102,241,0.15)" : "transparent",
                      color: activeStyle === style.id ? "#818cf8" : "#64748b",
                    }}
                    onMouseEnter={(e) => activeStyle !== style.id && (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={(e) => activeStyle !== style.id && (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ color: activeStyle === style.id ? "#818cf8" : "#475569" }}>{style.icon}</span>
                    {style.label}
                    {activeStyle === style.id && (
                      <svg className="ml-auto" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen toggle */}
          <MapButton onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} active={isFullscreen}>
            {isFullscreen ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
            )}
          </MapButton>
        </div>

        {/* ── Legend ── */}
        <div
          style={{
            position: "absolute", bottom: 40, left: 16, zIndex: 10,
            background: "rgba(10,12,20,0.82)", backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
            padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <p style={{ color: "#475569", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Legend
          </p>
          <div className="flex items-center gap-2">
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#22c55e", display: "inline-block", flexShrink: 0 }} />
            <span style={{ color: "#94a3b8", fontSize: 11 }}>Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#f59e0b", display: "inline-block", flexShrink: 0 }} />
            <span style={{ color: "#94a3b8", fontSize: 11 }}>Pending</span>
          </div>
        </div>

        {/* ── Properties count ── */}
        <div
          style={{
            position: "absolute", bottom: 40, right: 60, zIndex: 10,
            background: "rgba(10,12,20,0.82)", backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
            padding: "6px 12px", display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 6px #818cf8", display: "inline-block" }} />
          <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>
            {propertiesCount} {propertiesCount === 1 ? "property" : "properties"}
          </span>
        </div>

        {/* ── Style loading overlay ── */}
        {isStyleLoading && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 20,
            background: "rgba(10,12,20,0.5)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              background: "rgba(10,12,20,0.9)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, padding: "16px 24px", display: "flex", alignItems: "center", gap: 10,
            }}>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Switching style...</span>
            </div>
          </div>
        )}

        {/* ── Fullscreen ESC hint ── */}
        {isFullscreen && (
          <div style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 10,
            background: "rgba(10,12,20,0.7)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            padding: "5px 12px", color: "#475569", fontSize: 11,
          }}>
            Press <kbd style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4, color: "#64748b" }}>ESC</kbd> or click <span style={{ color: "#818cf8" }}>⛶</span> to exit fullscreen
          </div>
        )}
      </div>
    </>
  );
}