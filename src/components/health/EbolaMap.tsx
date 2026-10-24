// components/EbolaMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface EbolaRecord {
  countryCode: string;
  countryName: string;
  year: number;
  ebolaCases: number;
  coordinates: [number, number];
}

export default function EbolaMap() {
  const [data, setData] = useState<EbolaRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const ingestData = async () => {
      try {
        const response = await fetch('/api/ebola');
        const json = await response.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (err) {
        console.error("Front-end context acquisition failure:", err);
      } finally {
        setLoading(false);
      }
    };
    ingestData();
  }, []);

  const getRadiusAndColor = (cases: number) => {
    if (cases >= 10000) return { color: "#450a0a", fillColor: "#7f1d1d", radius: 12 }; // Severe Epidemic Vector (>10k)
    if (cases >= 1000)  return { color: "#7f1d1d", fillColor: "#b91c1c", radius: 10 }; // Active Outbreak (1k - 10k)
    if (cases >= 100)   return { color: "#9a3412", fillColor: "#ea580c", radius: 8 }; // Contained Cluster (100 - 1k)
    return { color: "#854d0e", fillColor: "#eab308", radius: 7 };                     // Trace Signatures (<100)
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span>Ingesting active global epidemic tracking indicators...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-0 [&_.leaflet-container]:!bg-[#abd3df]">
      <MapContainer center={[2, 12]} zoom={3} className="h-full w-full absolute inset-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data && data.map((record) => {
          const position = record.coordinates;
          if (!position || position.length !== 2) return null;

          const nameStr = record.countryName;
          const isoCode = record.countryCode;
          const cycleYear = record.year;
          
          // 🌟 COMPRESSED formatting token (Zero spaces between metric fields)
          const casesMetricStr = `${record.ebolaCases.toLocaleString()}Cases`;
          const mapStyles = getRadiusAndColor(record.ebolaCases);

          return (
            <CircleMarker
              key={`${isoCode}-${cycleYear}`}
              center={position}
              radius={mapStyles.radius}
              fillColor={mapStyles.fillColor}
              color={mapStyles.color}
              weight={1.5}
              opacity={0.95}
              fillOpacity={0.75}
            >
              {/* 🌟 Leaflet content padding reset override layout rules */}
              <Popup className="[&_.leaflet-popup-content]:!m-0 [&_.leaflet-popup-content]:!p-0">
                <div className="w-[340px] font-sans text-slate-800 p-3">

                  {/* Component Header Block */}
                  <div className="bg-slate-900 text-slate-100 px-3 py-2 rounded-t-md font-bold text-xs uppercase tracking-wider shadow-sm flex justify-between items-center">
                    <span>Active Cases</span>
                    <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                      EPIDEMIC_SURVEILLANCE
                    </span>
                  </div>

                  {/* Component Structured Data Rows */}
                  <div className="border border-slate-200 bg-white rounded-b-md divide-y divide-slate-100 overflow-hidden shadow-sm">

                    {/* Row 1: Country Profile */}
                    <div className="flex items-center min-h-[36px]">
                      <div className="w-[30%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        Country
                      </div>
                      <div className="w-[70%] px-3 py-2 text-xs font-bold text-slate-900 whitespace-nowrap">
                        {nameStr}
                      </div>
                    </div>

                    {/* Row 2: ISO Mapping Field */}
                    <div className="flex items-center min-h-[36px]">
                      <div className="w-[30%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        ISO Code
                      </div>
                      <div className="w-[70%] px-3 py-2 text-xs font-mono text-slate-700 font-semibold whitespace-nowrap">
                        {isoCode}
                      </div>
                    </div>

                    {/* Row 3: Evaluation Vector Year */}
                    <div className="flex items-center min-h-[36px]">
                      <div className="w-[30%] bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        Ref Year
                      </div>
                      <div className="w-[70%] px-3 py-2 text-xs text-slate-800 font-medium whitespace-nowrap">
                        {cycleYear}
                      </div>
                    </div>

                    {/* Row 4: Final Zero-Space Core Compression Row */}
                    <div className="flex items-center min-h-[44px] bg-slate-50/30">
                      <div className="w-[30%] bg-slate-100/50 px-2 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-r border-slate-200 self-stretch flex items-center whitespace-nowrap">
                        Active Cases
                      </div>
                      <div className="w-[70%] px-3 py-2 text-xs font-black text-slate-950 font-mono tracking-tight whitespace-nowrap">
                        {casesMetricStr}
                      </div>
                    </div>

                  </div>

                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Symmetrical Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-sans">
        <div className="font-bold text-slate-800 dark:text-slate-200">Ebola Epidemic Vector Classification</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7f1d1d] block border border-red-950" /> <span>Severe Outbreak Cluster (&ge;10,000)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#b91c1c] block border border-red-900" /> <span>Active Vector (1,000 - 9,999)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ea580c] block border border-orange-900" /> <span>Contained Core (100 - 999)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#eab308] block border border-yellow-900" /> <span>Trace Signature (&lt;100)</span></div>
      </div>
    </div>
  );
}