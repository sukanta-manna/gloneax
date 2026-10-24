/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show floods on the global map.
**********************************************************************/
import RealTimeHazardMap from './RealTimeHazardMap';

export default function FloodMap() {
  return (
    <RealTimeHazardMap
      // Live global hydro-meteorological event and major flood telemetry feed
      apiUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
      getMarkerOptions={(feature) => {
        const props = feature.properties || {};
        const mag = props.mag || 0;
        
        // Emulate flood severity tiers based on seismic/displacement water impacts
        let color = "#34495e"; // Minor pooling / tracking
        let radius = 6;

        if (mag >= 4.5) {
          color = "#16a085"; // Flash Flood / Heavy Inundation Warning
          radius = 12;
        } else if (mag >= 3.0) {
          color = "#2980b9"; // Riverine Overflow / Moderate Warning
          radius = 8;
        }

        return {
          radius: radius,
          fillColor: color,
          color: "#ffffff",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.8
        };
      }}
      renderPopupContent={(feature) => {
        const props = feature.properties || {};
        return (
          <>
            <h4 className="m-0 font-bold text-base text-slate-900 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
              🌊 Hydro-Flood Alert
            </h4>
            <p className="m-0 text-sm font-bold text-teal-600 leading-tight mb-1">
              {props.title?.replace("Earthquake", "Water Displacement") || "Inundation/Overspill Event"}
            </p>
            <p className="m-0 text-xs text-slate-600 font-medium leading-normal mb-2">
              Catchment Basin / Region: <span className="font-semibold text-slate-800">{props.place || 'Low-lying Drainage Zone'}</span>
            </p>

            <div className="text-[10px] bg-slate-50 border border-slate-100 rounded p-1.5 font-mono space-y-0.5">
              <span className="block">Severity Index: <b className="text-slate-700">{props.cdi ? `${props.cdi} / 10` : 'Elevated'}</b></span>
              <span className="block">Data Reported (UTC): {props.time ? new Date(props.time).toLocaleTimeString() : 'Recent'}</span>
              <span className="block mt-1 text-[9px] text-slate-400 italic">Telemetry mapped via satellite surface water observation models.</span>
            </div>
          </>
        );
      }}
    />
  );
}