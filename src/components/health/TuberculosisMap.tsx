// src/components/TuberculosisMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface TbRecord {
  countryCode: string;
  countryName: string;
  year: number;
  tbCases: number;
  displayCases: string;
  coordinates: [number, number];
}

export default function TuberculosisMap() {
  const [data, setData] = useState<TbRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTbData = async () => {
      try {
        const response = await fetch('/api/tuberculosis');
        const json = await response.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (error) {
        console.error("Error fetching Tuberculosis mapping metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTbData();
  }, []);

  // 🌟 Color breaks calibrated for raw numbers of annual estimated active TB incidents
  const getMarkerProperties = (cases: number) => {
    if (cases >= 100000) return { color: "#4c0519", fillColor: "#881337", radius: 15 }; // High Endemic (Burgundy)
    if (cases >= 25000)  return { color: "#7c2d12", fillColor: "#c2410c", radius: 12 }; // Intermediate-High (Orange)
    if (cases >= 5000)   return { color: "#713f12", fillColor: "#b45309", radius: 10 }; // Intermediate-Low (Amber)
    return { color: "#1e3a8a", fillColor: "#3b82f6", radius: 5 };                        // Low Endemic (Blue)
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span>Ingesting WHO Global Tuberculosis tracking datasets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-0 [&_.leaflet-container]:!bg-[#abd3df]">
      <MapContainer center={[12, 5]} zoom={2.5} className="h-full w-full absolute inset-0">
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
          const displayVal = record.displayCases || record.tbCases?.toLocaleString() || "0";

          const styles = getMarkerProperties(record.tbCases || 0);

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
                  <div className="bg-slate-900 text-slate-100 px-3 py-2 rounded-t-md font-bold text-xs uppercase tracking-wider shadow-sm flex justify-between items-center">
                    <span>Incidence Matrix</span>
                    <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                      WHO_DATA
                    </span>
                  </div>

                  <div className="border-x border-b border-slate-200 bg-white rounded-b-md divide-y divide-slate-100 overflow-hidden shadow-sm">
                    <div className="flex items-center min-h-[36px]">
                      <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        Country
                      </div>
                      <div className="w-2/3 px-2 py-2 text-xs font-bold text-slate-900 leading-tight">
                        {cName}
                      </div>
                    </div>

                    <div className="flex items-center min-h-[36px]">
                      <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        ISO Code
                      </div>
                      <div className="w-2/3 px-2 py-2 text-xs font-mono text-slate-700 font-semibold">
                        {cCode}
                      </div>
                    </div>

                    <div className="flex items-center min-h-[36px]">
                      <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        Ref Year
                      </div>
                      <div className="w-2/3 px-2 py-2 text-xs text-slate-800 font-medium">
                        {mapYear}
                      </div>
                    </div>

                    <div className="flex items-center min-h-[44px] bg-slate-50/30">
                      <div className="w-1/3 bg-slate-100/50 px-2 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        Est Cases
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
      <div className="absolute bottom-4 left-4 z-[400] bg-white dark:bg-slate-900 p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-sans min-w-[180px]">
        <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">Annual Tuberculosis Incidence</div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block border border-rose-950 flex-shrink-0" style={{ backgroundColor: '#881337' }} /> 
          <span className="text-slate-700 dark:text-slate-300">High Endemic (&ge; 100,000 cases)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block border border-orange-950 flex-shrink-0" style={{ backgroundColor: '#c2410c' }} /> 
          <span className="text-slate-700 dark:text-slate-300">Intermediate-High (25k - 99k)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block border border-amber-950 flex-shrink-0" style={{ backgroundColor: '#b45309' }} /> 
          <span className="text-slate-700 dark:text-slate-300">Intermediate-Low (5k - 24k)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block border border-blue-950 flex-shrink-0" style={{ backgroundColor: '#3b82f6' }} /> 
          <span className="text-slate-700 dark:text-slate-300">Low Endemic (&lt; 5,000 cases)</span>
        </div>
      </div>
    </div>
  );
}