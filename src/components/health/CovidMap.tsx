// components/CovidMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// A expanded lightweight coordinate registry matching common WHO 2-letter country codes
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  "US": [37.0902, -95.7129],
  "USA": [37.0902, -95.7129],
  "United States": [37.0902, -95.7129],
  "Brazil": [-14.2350, -51.9253],
  "India": [20.5937, 78.9629],
  "Japan": [36.2048, 138.2529],
  "France": [46.2276, 2.2137],
  "Germany": [51.1657, 10.4515],
  "UK": [55.3781, -3.4360],
  "United Kingdom": [55.3781, -3.4360],
  "Italy": [41.8719, 12.5674],
  "Spain": [40.4637, -3.7492],
  "Russia": [61.5240, 105.3188],
  "South Africa": [-30.5595, 22.9375],
  "Australia": [-25.2744, 133.7751]
};

// Inside the .map() loop switch record lookup index reference from code to direct name string:


interface WhoLatestCovidRecord {
  countryCode: string;
  country: string;
  casesInLast7Days: number;
  cumulativeCases: number;
  lastUpdated: string;
}

export default function CovidMap() {
  const [data, setData] = useState<WhoLatestCovidRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  const fetchWhoData = async () => {
    try {
      // 🌟 Updated from '/api/covid.json' to direct endpoint '/api/covid'
      const response = await fetch('/api/covid');
      const json = await response.json();
      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (error) {
      console.error("Error formatting WHO latest cases:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchWhoData();
}, []);

  // 🌟 Dynamic Styling Scale reflecting 7-day transmission alert levels
  const getMarkerWeight = (cases: number) => {
    if (cases > 50000) return { color: "#c0392b", radius: 24 }; // Critical Alert: Crimson
    if (cases > 10000) return { color: "#e67e22", radius: 16 }; // Elevated Active Spread: Orange
    if (cases > 1000)  return { color: "#f1c40f", radius: 10 }; // Moderate Spread: Yellow
    return { color: "#3498db", radius: 6 };                    // Low / Baseline Monitoring: Blue
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span>Syncing 7-day rolling case telemetry from WHO...</span>
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

        {data && data.map((record, index) => {
          const coords = COUNTRY_COORDINATES[record.countryCode];
  if (!coords) return null;

  const styles = getMarkerWeight(record.casesInLast7Days);
          const formattedDate = record.lastUpdated ? new Date(record.lastUpdated).toLocaleDateString() : "Recent Data";

          return (
            <CircleMarker
              key={`${record.countryCode}-${index}`}
              center={coords}
              radius={styles.radius}
              fillColor={styles.color}
              color="#ffffff"
              weight={1.2}
              opacity={0.95}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="p-1 font-sans text-slate-800 min-w-[200px]">
                  <div className="border-b border-slate-100 pb-1 mb-2">
                    <h4 className="m-0 font-bold text-sm text-slate-900">
                      {record.country} ({record.countryCode})
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      WHO Bulletin Date: {formattedDate}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center bg-red-50 dark:bg-red-950/20 px-1.5 py-1 rounded border border-red-100/50">
                      <span className="text-red-700 font-medium">Cases (Last 7 Days):</span>
                      <span className="font-bold text-red-700">
                        {record.casesInLast7Days.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-slate-500 pt-1 px-0.5">
                      <span>Cumulative Cases:</span>
                      <span className="font-semibold text-slate-700">
                        {record.cumulativeCases.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* WHO Epidemiological Active Data Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-sans">
        <div className="font-bold text-slate-800 dark:text-slate-200">WHO 7-Day Active Cases</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#c0392b] block" /> <span>Critical (&gt;50k)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#e67e22] block" /> <span>Elevated (10k - 50k)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f1c40f] block" /> <span>Moderate (1k - 10k)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3498db] block" /> <span>Baseline (&lt;1k)</span></div>
      </div>
    </div>
  );
}