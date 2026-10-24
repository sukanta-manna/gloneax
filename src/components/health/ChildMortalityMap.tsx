/********************************************************************* 
Author: Sukanta Manna  
Purpose: Child mortality map
**********************************************************************/
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MortalityRecord {
  countryCode: string;
  countryName: string;
  year: number;
  mortalityRate: number;
  coordinates: [number, number];
}

export default function ChildMortalityMap() {
  const [data, setData] = useState<MortalityRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMortalityData = async () => {
      try {
        const response = await fetch('/api/childMortality');
        const json = await response.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (error) {
        console.error("Error fetching Child Mortality mapping metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMortalityData();
  }, []);

  const getMarkerProperties = (value: number) => {
    if (value >= 70) return { color: "#7f1d1d", fillColor: "#b91c1c", radius: 22 }; // Critical (>70)
    if (value >= 40) return { color: "#9a3412", fillColor: "#ea580c", radius: 16 }; // Elevated (40 - 69)
    if (value >= 15) return { color: "#854d0e", fillColor: "#eab308", radius: 10 }; // Moderate (15 - 39)
    return { color: "#1e3a8a", fillColor: "#3b82f6", radius: 5 };                 // Low (<15)
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span>Ingesting WHO Global Child Mortality tracking datasets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-0 [&_.leaflet-container]:!bg-[#abd3df]">
      <MapContainer center={[10, 0]} zoom={2.5} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data && data.map((record) => {
          const coords = record.coordinates;
          if (!coords || coords.length !== 2) return null;

          const cName = record.countryName || "Unknown Country";
          const cCode = record.countryCode || "UNK";
          const mapYear = record.year || "N/A";
          
          // 🌟 COMPRESSED string value (Zero spaces between metric figures and unit text)
          const displayVal = record.mortalityRate ? `${record.mortalityRate.toFixed(1)}/1k Births` : "N/A";

          const styles = getMarkerProperties(record.mortalityRate || 0);

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
              {/* 🌟 RESET: Erasing default Leaflet padding properties to ensure symmetrical p-3 gutters */}
              <Popup className="[&_.leaflet-popup-content]:!m-0 [&_.leaflet-popup-content]:!p-0">
                <div className="w-[260px] font-sans text-slate-800 p-4">

                  {/* Form Header */}
                  <div className="bg-slate-900 text-slate-100 px-3 py-2 rounded-t-md font-bold text-xs uppercase tracking-wider shadow-sm flex justify-between items-center">
                    <span>Child Mortality</span>
                    <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                      WHO_DATA
                    </span>
                  </div>

                  {/* Form Body Fields Container with uniform 4-sided outline box */}
                  <div className="border border-slate-200 bg-white rounded-b-md divide-y divide-slate-100 overflow-hidden shadow-sm">

                    {/* Row 1: Country Name */}
                    <div className="flex items-center min-h-[36px]">
                      {/* Left side fixed at exactly 30% width so that "Active Cases" or similar labels fit without breakages */}
                      <div className="w-[35%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        Country
                      </div>
                      <div className="w-[65%] px-3 py-2 text-xs font-bold text-slate-900 whitespace-nowrap">
                        {cName}
                      </div>
                    </div>

                    {/* Row 2: Country Code */}
                    <div className="flex items-center min-h-[36px]">
                      <div className="w-[35%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        ISO Code
                      </div>
                      <div className="w-[65%] px-3 py-2 text-xs font-mono text-slate-700 font-semibold whitespace-nowrap">
                        {cCode}
                      </div>
                    </div>

                    {/* Row 3: Tracking Year */}
                    <div className="flex items-center min-h-[36px]">
                      <div className="w-[35%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        Ref Year
                      </div>
                      <div className="w-[65%] px-3 py-2 text-xs text-slate-800 font-medium whitespace-nowrap">
                        {mapYear}
                      </div>
                    </div>

                    {/* Row 4: Under-5 Mortality Rate Core Field */}
                    <div className="flex items-center min-h-[44px] bg-slate-50/30">
                      <div className="w-[35%] bg-slate-100/50 px-2 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        Mortality
                      </div>
                      <div className="w-[65%] px-3 py-2 text-xs font-black text-slate-950 font-mono tracking-tight whitespace-nowrap">
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
        <div className="font-bold text-slate-800 dark:text-slate-200">Mortality Rate Key (Per 1k)</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#b91c1c] block border border-red-900" /> <span>Critical (&ge;70)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ea580c] block border border-orange-900" /> <span>Elevated (40 - 69)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#eab308] block border border-yellow-900" /> <span>Moderate (15 - 39)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3b82f6] block border border-blue-900" /> <span>Low (&lt;15)</span></div>
      </div>
    </div>
  );
}