// components/HIVMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface HivRecord {
    countryCode: string;
    countryName: string; // 🌟 Updated property field
    year: number;
    hivCases: number;
    displayCases: string;
    coordinates: [number, number];
}

export default function HIVMap() {
    const [data, setData] = useState<HivRecord[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHivData = async () => {
            try {
                const response = await fetch('/api/hiv');
                const json = await response.json();
                if (Array.isArray(json)) {
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching HIV mapping metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHivData();
    }, []);

    // 🌟 Logarithmic scaling prevents large populations from taking over the map view
    const getMarkerProperties = (cases: number) => {
        if (cases >= 500000) return { color: "#7f1d1d", fillColor: "#b91c1c", radius: 22 }; // Severe (>500k)
        if (cases >= 100000) return { color: "#9a3412", fillColor: "#ea580c", radius: 16 }; // High (100k - 500k)
        if (cases >= 10000) return { color: "#854d0e", fillColor: "#eab308", radius: 10 }; // Moderate (10k - 100k)
        return { color: "#1e3a8a", fillColor: "#3b82f6", radius: 5 };                        // Low (<10k)
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                    <span>Ingesting WHO Global HIV tracking datasets...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative z-0 [&_.leaflet-container]:!bg-[#abd3df]">
            <MapContainer center={[10, 0]} zoom={2.5} className="h-full w-full absolute inset-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {data && data.map((record) => {
                    const coords = record.coordinates;
                    if (!coords || coords.length !== 2) return null;

                    const cName = record.countryName || record["countryName"] || "Unknown Country";
                    const cCode = record.countryCode || record["countryCode"] || "UNK";
                    const mapYear = record.year || "N/A";
                    const displayVal = record.displayCases || record.hivCases?.toLocaleString() || "0";

                    const styles = getMarkerProperties(record.hivCases || 0);

                    return (
                        <CircleMarker
                            key={`${cCode}-${mapYear}`}
                            center={coords}
                            radius={styles.radius}
                            fillColor={styles.fillColor}
                            color={styles.color}
                            weight={1.2}
                            opacity={0.9}
                            fillOpacity={0.65}
                        >
                            <Popup mdc-custom="true">
                                <div className="w-[260px] font-sans text-slate-800 p-1">

                                    {/* Form Header */}
                                    <div className="bg-slate-900 text-slate-100 px-3 py-2 rounded-t-md font-bold text-xs uppercase tracking-wider shadow-sm flex justify-between items-center">
                                        <span>Active Cases</span>
                                        <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                                            WHO_DATA
                                        </span>
                                    </div>

                                    {/* Form Body Fields Container */}
                                    <div className="border-x border-b border-slate-200 bg-white rounded-b-md divide-y divide-slate-100 overflow-hidden shadow-sm">

                                        {/* Row 1: Country Name */}
                                        <div className="flex items-center min-h-[36px]">
                                            <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                                                Country
                                            </div>
                                            <div className="w-2/3 px-2 py-2 text-xs font-bold text-slate-900 leading-tight">
                                                {cName}
                                            </div>
                                        </div>

                                        {/* Row 2: Country Code */}
                                        <div className="flex items-center min-h-[36px]">
                                            <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                                                ISO Code
                                            </div>
                                            <div className="w-2/3 px-2 py-2 text-xs font-mono text-slate-700 font-semibold">
                                                {cCode}
                                            </div>
                                        </div>

                                        {/* Row 3: Tracking Year */}
                                        <div className="flex items-center min-h-[36px]">
                                            <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                                                Ref Year
                                            </div>
                                            <div className="w-2/3 px-2 py-2 text-xs text-slate-800 font-medium">
                                                {mapYear}
                                            </div>
                                        </div>

                                        {/* Row 4: Metrics Core Burden Data */}
                                        <div className="flex items-center min-h-[44px] bg-slate-50/30">
                                            <div className="w-1/3 bg-slate-100/50 px-2 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                                                HIV Cases
                                            </div>
                                            <div className="w-2/3 px-2 py-2 text-sm font-black text-slate-950 font-mono tracking-tight leading-normal">
                                                {displayVal}
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Map Legend Overlay Card */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-sans">
                <div className="font-bold text-slate-800 dark:text-slate-200">Estimated HIV Burden</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#b91c1c] block border border-red-900" /> <span>Critical (&gt;500k cases)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ea580c] block border border-orange-900" /> <span>High (100k - 500k)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#eab308] block border border-yellow-900" /> <span>Moderate (10k - 100k)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3b82f6] block border border-blue-900" /> <span>Baseline (&lt;10k cases)</span></div>
            </div>
        </div>
    );
}