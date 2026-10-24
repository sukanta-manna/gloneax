// components/LifeExpectancyMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


interface ExpectancyRecord {
    countryCode: string;
    countryName: string;
    year: number;
    lifeExpectancy: number;
    coordinates: [number, number];
}

export default function LifeExpectancyMap() {
    const [data, setData] = useState<ExpectancyRecord[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchExpectancyData = async () => {
            try {
                const response = await fetch('/api/lifeExpectancy');
                const json = await response.json();
                if (Array.isArray(json)) {
                    setData(json);
                }
            } catch (error) {
                console.error("Error reading life expectancy values:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpectancyData();
    }, []);

    // Grading color themes matching statistical age deviations
    const getMarkerStyle = (age: number) => {
        if (age >= 80) return { color: "#2c3e50", fillColor: "#2ecc71", radius: 10 }; // High (80+): Vibrant Emerald Green
        if (age >= 70) return { color: "#2c3e50", fillColor: "#3498db", radius: 8 }; // Mid-High (70-80): Ocean Blue
        if (age >= 60) return { color: "#2c3e50", fillColor: "#e67e22", radius: 6 };  // Mid-Low (60-70): Orange
        return { color: "#2c3e50", fillColor: "#e74c3c", radius: 7 };                 // Low (<60): Warning Crimson
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                    <span>Polling official WHO Life Expectancy indices...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative z-0 [&_.leaflet-container]:!bg-[#abd3df]">
            <MapContainer center={[20, 0]} zoom={2} className="h-full w-full absolute inset-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {data && data.map((record) => {
                    // 🌟 No more manual dictionary registry lookups! 
                    // Read coordinates directly out of the data payload.
                    const coords = record.coordinates;
                    if (!coords || coords.length !== 2) return null;

                    const cName = record.countryName || record["countryName"] || "Unknown Country";
                    const cCode = record.countryCode || record["countryCode"] || "UNK";
                    const mapYear = record.year || "N/A";
                    
                    // Formats numerical indicator value to sit cleanly without spaces
                    const displayVal = record.lifeExpectancy ? `${record.lifeExpectancy}Years` : "N/A";

                    const styles = getMarkerStyle(record.lifeExpectancy);

                    return (
                        <CircleMarker
                            key={record.countryCode}
                            center={coords}
                            radius={styles.radius}
                            fillColor={styles.fillColor}
                            color={styles.color}
                            weight={1.2}
                            opacity={0.9}
                            fillOpacity={0.75}
                        >
                            <Popup className="[&_.leaflet-popup-content]:!m-0 [&_.leaflet-popup-content]:!p-0">
                                <div className="w-[260px] font-sans text-slate-800 p-4">

                                    {/* Form Header */}
                                    <div className="bg-slate-900 text-slate-100 px-3 py-2 rounded-t-md font-bold text-xs uppercase tracking-wider shadow-sm flex justify-between items-center">
                                        <span>Life Expectancy</span>
                                        <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                                            WHO_DATA
                                        </span>
                                    </div>

                                    {/* Form Body Fields Container with uniform 4-sided borders */}
                                    <div className="border border-slate-200 bg-white rounded-b-md divide-y divide-slate-100 overflow-hidden shadow-sm">

                                        {/* Row 1: Country Name */}
                                        <div className="flex items-center min-h-[36px]">
                                            <div className="w-[37%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                                                Country
                                            </div>
                                            <div className="w-[63%] px-3 py-2 text-xs font-bold text-slate-900 whitespace-nowrap">
                                                {cName}
                                            </div>
                                        </div>

                                        {/* Row 2: Country Code */}
                                        <div className="flex items-center min-h-[36px]">
                                            <div className="w-[37%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                                                ISO Code
                                            </div>
                                            <div className="w-[63%] px-3 py-2 text-xs font-mono text-slate-700 font-semibold whitespace-nowrap">
                                                {cCode}
                                            </div>
                                        </div>

                                        {/* Row 3: Tracking Year */}
                                        <div className="flex items-center min-h-[36px]">
                                            <div className="w-[37%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                                                Ref Year
                                            </div>
                                            <div className="w-[63%] px-3 py-2 text-xs text-slate-800 font-medium whitespace-nowrap">
                                                {mapYear}
                                            </div>
                                        </div>

                                        {/* Row 4: Metrics Core Burden Data */}
                                        <div className="flex items-center min-h-[44px] bg-slate-50/30">
                                            <div className="w-[37%] bg-slate-100/50 px-2 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                                                Expectancy
                                            </div>
                                            <div className="w-[63%] px-3 py-2 text-xs font-black text-slate-950 font-mono tracking-tight whitespace-nowrap">
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

            {/* Static Visual Data Legend Map Overlay */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-sans">
                <div className="font-bold text-slate-800 dark:text-slate-200">Life Expectancy at Birth</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2ecc71] block border border-slate-400" /> <span>High (&gt;80 Years)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3498db] block border border-slate-400" /> <span>Moderate High (70 - 80)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#e67e22] block border border-slate-400" /> <span>Moderate Low (60 - 70)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#e74c3c] block border border-slate-400" /> <span>Critical Low (&lt;60 Years)</span></div>
            </div>
        </div>
    );
}