import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import ReactDOMServer from 'react-dom/server';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface HazardFeature {
    type: "Feature";
    properties: any;
    geometry: any; // Allow the standard engine to handle shape types (Points, Polygons, Collections)
}

interface HazardGeoJson {
    type: "FeatureCollection";
    features: HazardFeature[];
}

interface RealTimeHazardMapProps {
    apiUrl: string;
    refreshIntervalMs?: number;
    getMarkerOptions: (feature: any) => L.CircleMarkerOptions; // Use generic fallback matching react-leaflet
    renderPopupContent: (feature: any) => React.ReactNode;
}

function MapBoundsController({ data }: { data: HazardGeoJson | null }) {
    const map = useMap();

    useEffect(() => {
        // Ensure features array exists and contains valid map elements before checking bounds
        if (data && Array.isArray(data.features) && data.features.length > 0) {
            try {
                const geoJsonLayer = L.geoJSON(data as any);
                const bounds = geoJsonLayer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [20, 20] });
                }
            } catch (e) {
                console.warn("Could not parse map positioning auto-bounds:", e);
            }
        }
    }, [data, map]);

    return null;
}

export default function RealTimeHazardMap({
    apiUrl,
    refreshIntervalMs = 120000,
    getMarkerOptions,
    renderPopupContent
}: RealTimeHazardMapProps) {
    const [hazardData, setHazardData] = useState<HazardGeoJson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorState, setErrorState] = useState<string | null>(null);

    const fetchHazardData = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP status error: ${response.status}`);

            let data = await response.json();

            // Normalize payload structure if wrapped inside an inner data object property
            let normalizedFeatures: HazardFeature[] = [];
            if (data) {
                if (Array.isArray(data.features)) {
                    normalizedFeatures = data.features;
                } else if (data.data && Array.isArray(data.data.features)) {
                    normalizedFeatures = data.data.features;
                } else if (Array.isArray(data)) {
                    normalizedFeatures = data.filter(f => f.type === "Feature");
                }
            }

            setHazardData({
                type: "FeatureCollection",
                features: normalizedFeatures
            });
            setErrorState(null);
        } catch (error) {
            console.error(`Error pulling data from ${apiUrl}:`, error);
            setErrorState("Failed to stream hazard telemetry data layers.");
        } finally {
            // Always terminate the loading screen phase regardless of result
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchHazardData();
        const interval = setInterval(fetchHazardData, refreshIntervalMs);
        return () => clearInterval(interval);
    }, [apiUrl, refreshIntervalMs]);

    const pointToLayer = (feature: HazardFeature, latlng: LatLng) => {
        try {
            const options = getMarkerOptions(feature);
            return L.circleMarker(latlng, options);
        } catch (e) {
            return L.circleMarker(latlng, { radius: 5, fillColor: "#3388ff" });
        }
    };

    const onEachFeature = (feature: any, layer: L.Layer) => {
        try {
            const popupNode = renderPopupContent(feature);
            if (popupNode) {
                const popupHtml = ReactDOMServer.renderToString(
                    <div className="p-1 font-sans text-slate-800 min-w-45">
                        {popupNode}
                    </div>
                );
                layer.bindPopup(popupHtml);
            }
        } catch (e) {
            console.error("Popup render layout failure:", e);
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                    <span>Loading real-time hazard layers...</span>
                </div>
            </div>
        );
    }

    if (errorState) {
        return (
            <div className="p-6 font-sans text-red-500 font-medium bg-red-50 dark:bg-red-950/20 rounded-lg m-4 border border-red-100 dark:border-red-900/30">
                ⚠️ {errorState}
            </div>
        );
    }

    const hasData = hazardData && hazardData.features && hazardData.features.length > 0;

    return (
        <div
            id="map"
            className="w-full h-full min-h-[500px] relative z-0 [&_.leaflet-container]:!bg-[#abd3df]" 
        >
            <MapContainer center={[0, 0]} zoom={2} className="h-full w-full absolute inset-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hasData && (
                    <GeoJSON
                        key={`${hazardData.features.length}-${apiUrl}`}
                        data={hazardData}
                        pointToLayer={pointToLayer}
                        onEachFeature={onEachFeature}
                        style={(feature: any) => getMarkerOptions(feature)}
                    />
                )}

                <MapBoundsController data={hazardData} />
            </MapContainer>

            {/* User Interface Notification overlay if there are zero active storm warnings worldwide */}
            {!hasData && (
                <div className="absolute bottom-4 left-4 z-400 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-md shadow-sm border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    No active extreme hazard threats tracked at this moment.
                </div>
            )}
        </div>
    );
}