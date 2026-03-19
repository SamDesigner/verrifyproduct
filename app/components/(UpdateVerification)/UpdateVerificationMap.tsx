"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useUpdateVerificationStore } from "@/store/useUpdateVerificationStore";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function UpdateVerificationMap() {
    const { draft, updateField } = useUpdateVerificationStore();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [hasPolygon, setHasPolygon] = useState(!!draft.polygon);
    const [mapStyle, setMapStyle] = useState<"satellite" | "streets">("satellite");
    const [isStyleLoading, setIsStyleLoading] = useState(false);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [7.0134, 4.8156],
            zoom: 13,
        });

        drawRef.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: { polygon: true, trash: true },
            styles: [
                { id: "gl-draw-polygon-fill", type: "fill", filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]], paint: { "fill-color": "#6366f1", "fill-opacity": 0.2 } },
                { id: "gl-draw-polygon-stroke", type: "line", filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]], paint: { "line-color": "#818cf8", "line-width": 2.5 } },
                { id: "gl-draw-polygon-midpoint", type: "circle", filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]], paint: { "circle-radius": 4, "circle-color": "#818cf8" } },
                { id: "gl-draw-polygon-and-line-vertex-active", type: "circle", filter: ["all", ["==", "$type", "Point"], ["==", "meta", "vertex"]], paint: { "circle-radius": 6, "circle-color": "#fff", "circle-stroke-width": 2, "circle-stroke-color": "#6366f1" } },
            ],
        });

        mapRef.current.addControl(drawRef.current);
        mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");

        mapRef.current.on("load", () => {
            if (draft.polygon && drawRef.current) {
                const existingPolygon = draft.polygon as GeoJSON.Polygon;
                (drawRef.current as MapboxDraw & { add: (feature: GeoJSON.Feature) => void }).add({
                    type: "Feature",
                    geometry: existingPolygon,
                    properties: {},
                });

                const coords = existingPolygon.coordinates[0];
                const bounds = coords.reduce(
                    (b, coord) => b.extend(coord as [number, number]),
                    new mapboxgl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
                );
                mapRef.current?.fitBounds(bounds, { padding: 80, maxZoom: 17 });
                setHasPolygon(true);
            }
        });

        const handleUpdate = () => {
            const data = drawRef.current?.getAll();
            if (!data || data.features.length === 0) { updateField("polygon", null); setHasPolygon(false); return; }
            const feature = data.features[0];
            if (feature.geometry.type !== "Polygon") return;
            updateField("polygon", { type: "Polygon", coordinates: feature.geometry.coordinates } as GeoJSON.Polygon);
            setHasPolygon(true);
        };

        mapRef.current.on("draw.create", handleUpdate);
        mapRef.current.on("draw.update", handleUpdate);
        mapRef.current.on("draw.delete", () => { updateField("polygon", null); setHasPolygon(false); });

        return () => { mapRef.current?.remove(); };
    }, [updateField, draft.polygon]);

    const toggleStyle = () => {
        if (isStyleLoading) return;
        const next = mapStyle === "satellite" ? "streets" : "satellite";
        setIsStyleLoading(true);
        mapRef.current?.setStyle(next === "satellite" ? "mapbox://styles/mapbox/satellite-streets-v12" : "mapbox://styles/mapbox/dark-v11");
        mapRef.current?.once("styledata", () => setIsStyleLoading(false));
        setMapStyle(next);
    };

    return (
        <>
            <style>{`.mapboxgl-map { position: absolute !important; top: 0; left: 0; right: 0; bottom: 0; width: 100% !important; height: 100% !important; } .mapboxgl-canvas { width: 100% !important; height: 100% !important; }`}</style>
            <div className="flex flex-col gap-4">

                {/* Status bar */}
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: hasPolygon ? "rgba(52,211,153,0.1)" : "rgba(245,158,11,0.08)", border: `1px solid ${hasPolygon ? "rgba(52,211,153,0.3)" : "rgba(245,158,11,0.2)"}`, color: hasPolygon ? "#34d399" : "#f59e0b" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", display: "inline-block", flexShrink: 0, background: hasPolygon ? "#34d399" : "#f59e0b", boxShadow: hasPolygon ? "0 0 8px #34d399" : "0 0 8px #f59e0b" }} />
                        {hasPolygon ? "Boundary loaded ✓" : "No boundary drawn yet"}
                    </div>
                    <button onClick={toggleStyle} disabled={isStyleLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", cursor: isStyleLoading ? "wait" : "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                        </svg>
                        {mapStyle === "satellite" ? "Street view" : "Satellite"}
                    </button>
                </div>

                {/* Map */}
                <div style={{ position: "relative", width: "100%", height: "440px", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", isolation: "isolate" }}>
                    <div ref={mapContainerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

                    {/* Instruction card */}
                    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, maxWidth: 280, borderRadius: 12, padding: "10px 14px", background: "rgba(10,12,20,0.82)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="3 11 22 2 13 21 11 13 3 11" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ color: "#c7d2fe", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>Update boundary</p>
                            <p style={{ color: "#475569", fontSize: 11, lineHeight: 1.5 }}>Your existing boundary is pre-loaded. Delete and redraw to update, or keep as is.</p>
                        </div>
                    </div>

                    {/* Success badge */}
                    {hasPolygon && (
                        <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, background: "rgba(10,12,20,0.82)", backdropFilter: "blur(14px)", border: "1px solid rgba(52,211,153,0.3)" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span style={{ color: "#34d399", fontSize: 11, fontWeight: 600 }}>Boundary saved</span>
                        </div>
                    )}
                </div>

                {/* Tips */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: "✏️", tip: "Existing boundary is pre-loaded on the map" },
                        { icon: "🗑️", tip: "Use trash icon to delete and redraw" },
                        { icon: "✅", tip: "Double-click to complete a new shape" },
                    ].map(({ icon, tip }) => (
                        <div key={tip} className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <span style={{ fontSize: 14 }}>{icon}</span>
                            <p style={{ color: "#475569", fontSize: 11, lineHeight: 1.5 }}>{tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}