/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show avalanches on the global map.
**********************************************************************/
import RealTimeHazardMap from './RealTimeHazardMap';

export default function AvalancheMap() {
  return (
    <RealTimeHazardMap
      apiUrl="/api/avalanches"
      getMarkerOptions={(feature) => {
        const dangerLevel = feature?.properties?.danger_level || 1;
        
        let radius = 7;
        let fillColor = "#3498db"; // Low Danger: Mountain Blue
        let color = "#2980b9";

        if (dangerLevel >= 4) {
          radius = 13;
          fillColor = "#9b59b6"; // High/Extreme Alert: Purple Hazard Circle
          color = "#8e44ad";
        } else if (dangerLevel === 3) {
          radius = 10;
          fillColor = "#e74c3c"; // Considerable Danger: Crimson Red
          color = "#c0392b";
        } else if (dangerLevel === 2) {
          radius = 8.5;
          fillColor = "#e67e22"; // Moderate Danger: Orange
          color = "#d35400";
        }

        return {
          radius,
          fillColor,
          color,
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.8
        };
      }}
      renderPopupContent={(feature) => {
        const zoneName = feature.properties?.name || "Global Active Alpine Warning";
        const region = feature.properties?.region || "International Sector";
        const dangerLabel = feature.properties?.danger || "Variable Danger Matrix";
        const advice = feature.properties?.travel_advice || "Assess local snowpack conditions thoroughly before crossing steep slide paths.";

        return (
          <div className="p-1 min-w-60 max-w-70">
            <h4 className="m-0 font-bold text-base text-sky-600 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
              🏔️ Avalanche Hazard Profile
            </h4>
            
            <p className="m-0 text-sm text-slate-800 font-bold leading-tight">
              {zoneName}
            </p>
            <span className="text-[10px] text-slate-400 block mb-2 font-normal">
              Region Context: {region}
            </span>

            <div className="mb-2.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Status: {dangerLabel}
              </span>
            </div>

            <p className="m-0 text-xs text-slate-600 font-normal leading-normal italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-dashed">
              "{advice}"
            </p>
            
            <span className="text-[10px] text-slate-400 block font-normal mt-2.5 border-t pt-1">
              Source: Global Alpine Safety Network
            </span>
          </div>
        );
      }}
    />
  );
}
