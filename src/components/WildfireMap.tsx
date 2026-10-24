/********************************************************************* 
Author: Sukanta Manna  
Purpose: Fetch wildfire data from server using public API.
**********************************************************************/
import React from 'react';
import RealTimeHazardMap from './RealTimeHazardMap';

export default function WildfireMap() {
  return (
    <RealTimeHazardMap
      // 🌟 Targets your local secure type-checked server proxy endpoint route
      apiUrl="/api/wildfires"
      
      // 🌟 UPDATED: Accepts the feature parameter to dynamically determine styling metrics
      getMarkerOptions={(feature) => {
        // Extract Fire Radiative Power (FRP). Default to 15 MW if not specified or available
        const frp = feature?.properties?.frp || 15;
        
        let radius = 5;
        let fillColor = "#f1c40f"; // Low intensity: Yellow (e.g., small agricultural burns)
        let color = "#d35400";     // Secondary border
        
        // 🌟 Determine Intensity Threshold Scale Rules
        if (frp > 150) {
          // Extreme Critical Canopy Fire / High Energy Anomaly
          radius = 14;
          fillColor = "#8e44ad"; // Deep Purple/Crimson hazard indicator
          color = "#2c3e50";
        } else if (frp > 50) {
          // Major Wildfire / High intensity
          radius = 10;
          fillColor = "#c0392b"; // Hot Crimson Red
          color = "#7f8c8d";
        } else if (frp > 20) {
          // Moderate surface wildland blaze
          radius = 7.5;
          fillColor = "#e67e22"; // Flame Orange
          color = "#c0392b";
        }

        return {
          radius,
          fillColor,
          color,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.85
        };
      }}
      
      renderPopupContent={(feature) => {
        // Safe coordinate processing fallback
        const lat = feature.geometry?.coordinates?.[1]?.toFixed(2) || "0.00";
        const lon = feature.geometry?.coordinates?.[0]?.toFixed(2) || "0.00";
        
        const locationName = feature.properties.place || `Lat: ${lat}, Lon: ${lon}`;
        const confidence = feature.properties.confidence || "N/A";
        
        const brightT = feature.properties.bright_ti1 || feature.properties.brightness || "N/A";
        const frp = feature.properties.frp;
        const firePower = frp ? `${frp} MW` : "N/A";

        // 🌟 Determine text badge label for popup context visibility
        let intensityLabel = "Low Anomaly";
        let intensityBadgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        
        if (frp && frp > 150) {
          intensityLabel = "Extreme Wildfire / Mega-Burn";
          intensityBadgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 animate-pulse";
        } else if (frp && frp > 50) {
          intensityLabel = "High Severity Blaze";
          intensityBadgeClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        } else if (frp && frp > 20) {
          intensityLabel = "Moderate Surface Burn";
          intensityBadgeClass = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
        }

        return (
          <div className="p-1 min-w-57.5">
            <h4 className="m-0 font-bold text-base text-red-600 border-b border-slate-100 pb-1 mb-1.5 flex items-center justify-between gap-1.5">
              <span>🔥 Wildfire Hotspot</span>
            </h4>
            
            {/* 🌟 Intensity Badge Identifier */}
            <div className="mb-2">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${intensityBadgeClass}`}>
                {intensityLabel}
              </span>
            </div>

            <p className="m-0 text-xs text-slate-800 font-semibold leading-tight mb-15">
              Area Context: <span className="font-normal text-slate-600 block mt-0.5">{locationName}</span>
            </p>
            
            <div className="text-xs text-slate-500 space-y-0.5 mt-2 pt-1 border-t border-dashed border-slate-100">
              <div>Thermal Brightness: <span className="font-medium text-slate-700">{brightT} K</span></div>
              <div>Fire Radiative Power: <span className="font-bold text-slate-900 dark:text-slate-100">{firePower}</span></div>
              <div>Detection Confidence: <span className="font-medium text-slate-700">{confidence}</span></div>
            </div>
            
            <span className="text-[10px] text-slate-400 block font-normal mt-2 border-t pt-1">
              Source: NASA Satellite MODIS/VIIRS NRT
            </span>
          </div>
        );
      }}
    />
  );
}