/********************************************************************* 
Author: Sukanta Manna  
Purpose: Fetch volcano data from server using public API.
**********************************************************************/
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface VolcanoRecord {
  id: string;
  volcanoName: string;
  country: string;
  type: string;
  elevation: string;
  lastEruption: string;
  coordinates: [number, number];
}

export default function VolcanoMap() {
  const [data, setData] = useState<VolcanoRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVolcanoData = async () => {
      try {
        const response = await fetch('/api/volcano');
        const json = await response.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (error) {
        console.error("Error drawing Volcanic vector data map:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolcanoData();
  }, []);

  const getMarkerProperties = (elevationStr: string) => {
    const numericElevation = parseInt(elevationStr) || 0;
    if (numericElevation >= 3000) return { color: "#7c2d12", fillColor: "#b91c1c", radius: 13 }; // Crimson
    if (numericElevation >= 1500) return { color: "#b45309", fillColor: "#ea580c", radius: 9 };  // Orange
    return { color: "#713f12", fillColor: "#e67e22", radius: 5.5 };                              // Volcanic Amber
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span>Assembling global tectonic/volcanic distribution layers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative z-0 [&_.leaflet-container]:!bg-[#abd3df]">
      <MapContainer center={[10, 20]} zoom={2.3} className="h-full w-full absolute inset-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data && data.map((record) => {
          const coords = record.coordinates;
          if (!coords || coords.length !== 2) return null;

          const styles = getMarkerProperties(record.elevation);

          return (
            <CircleMarker
              key={record.id}
              center={coords}
              radius={styles.radius}
              fillColor={styles.fillColor}
              color={styles.color}
              weight={1}
              opacity={0.9}
              fillOpacity={0.75}
            >
              <Popup mdc-custom="true">
                <div className="w-[260px] font-sans text-slate-800 p-1">
                  
                  <div className="bg-slate-900 text-slate-100 px-3 py-2 rounded-t-md font-bold text-xs uppercase tracking-wider shadow-sm flex justify-between items-center">
                    <span>Volcanic Point Profile</span>
                    <span className="bg-orange-700 px-1.5 py-0.5 rounded text-[10px] text-orange-100 font-mono">
                      GVP_MIRROR
                    </span>
                  </div>

                  <div className="border-x border-b border-slate-200 bg-white rounded-b-md divide-y divide-slate-100 overflow-hidden shadow-sm">
                    
                    <div className="flex items-center min-h-[36px]">
                      <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        Name
                      </div>
                      <div className="w-2/3 px-2 py-2 text-xs font-bold text-slate-900 leading-tight">
                        {record.volcanoName}
                      </div>
                    </div>

                    <div className="flex items-center min-h-[36px]">
                      <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        Country
                      </div>
                      <div className="w-2/3 px-2 py-2 text-xs font-medium text-slate-800">
                        {record.country}
                      </div>
                    </div>

                    <div className="flex items-center min-h-[36px]">
                      <div className="w-1/3 bg-slate-50/70 px-2 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        Morphology
                      </div>
                      <div className="w-2/3 px-2 py-2 text-xs text-slate-700 italic">
                        {record.type}
                      </div>
                    </div>

                    <div className="flex items-center min-h-[44px] bg-amber-50/30">
                      <div className="w-1/3 bg-amber-100/30 px-2 py-2 text-[10px] uppercase font-bold text-amber-800 tracking-wider border-r border-slate-150 self-stretch flex items-center">
                        Alt / Eruption
                      </div>
                      <div className="w-2/3 px-2 py-2 text-xs font-mono text-slate-950 font-semibold leading-normal">
                        <div>Peak: <span className="text-orange-700 font-bold">{record.elevation}</span></div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Last Record: {record.lastEruption}</div>
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
        <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">Volcanic Peak Classification</div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block border border-red-950 flex-shrink-0" style={{ backgroundColor: '#b91c1c' }} /> 
          <span className="text-slate-700 dark:text-slate-300">Severe Altitude (&ge; 3,000m)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block border border-orange-950 flex-shrink-0" style={{ backgroundColor: '#ea580c' }} /> 
          <span className="text-slate-700 dark:text-slate-300">High Altitude (1,500m - 2,999m)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full block border border-amber-950 flex-shrink-0" style={{ backgroundColor: '#e67e22' }} /> 
          <span className="text-slate-700 dark:text-slate-300">Baseline Peak (&lt; 1,500m)</span>
        </div>
      </div>
    </div>
  );
}