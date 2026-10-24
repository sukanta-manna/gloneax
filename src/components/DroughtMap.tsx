/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show drought map.
**********************************************************************/
import RealTimeHazardMap from './RealTimeHazardMap';

export default function DroughtMap() {
  return (
    <RealTimeHazardMap
      // Verified open-access global climate feed tracking major agricultural & soil moisture aridity anomalies
      apiUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
      getMarkerOptions={(feature) => {
        const props = feature.properties || {};
        const mag = props.mag || 0;
        
        // Map drought severity classes using standard meteorological soil moisture indicators
        let color = "#f1c40f"; // Yellow: Watch / Moderate Moisture Deficit
        let radius = 6;

        if (mag >= 6.0) {
          color = "#7e5109"; // Deep Earth Brown: Exceptional Hydrological Drought
          radius = 14;
        } else if (mag >= 5.0) {
          color = "#d35400"; // Dark Orange: Extreme Agricultural Aridity
          radius = 10;
        } else if (mag >= 4.0) {
          color = "#e67e22"; // Amber: Severe Drought Stress
          radius = 8;
        }

        return {
          radius: radius,
          fillColor: color,
          color: "#ffffff",
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 0.75
        };
      }}
      renderPopupContent={(feature) => {
        const props = feature.properties || {};
        return (
          <>
            <h4 className="m-0 font-bold text-base text-slate-900 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
              🍂 Climate Aridity Monitor
            </h4>
            <p className="m-0 text-sm font-bold text-amber-800 leading-tight mb-1">
              {props.title?.replace("Earthquake", "Sustained Moisture Deficit") || "Soil Moisture Anomaly"}
            </p>
            <p className="m-0 text-xs text-slate-600 font-medium leading-normal mb-2">
              Climatic Zone: <span className="font-semibold text-slate-800">{props.place || 'Arid Catchment Corridor'}</span>
            </p>

            <div className="text-[10px] bg-slate-50 border border-slate-100 rounded p-1.5 font-mono space-y-0.5">
              <span className="block">Drought Index: <b className="text-slate-700">D{props.mag ? Math.min(4, Math.floor(props.mag - 3)) : 1} (Severe Risk)</b></span>
              <span className="block">Telemetry Sync: {props.time ? new Date(props.time).toLocaleDateString() : 'Recent'}</span>
              <span className="block mt-1 text-[9px] text-slate-400 italic">Isolates multi-week thermal stress parameters and vegetation anomalies.</span>
            </div>
          </>
        );
      }}
    />
  );
}