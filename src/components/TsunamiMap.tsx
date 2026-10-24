/********************************************************************* 
Author: Sukanta Manna  
Purpose: Fetch tsunami data from server using public API.
**********************************************************************/
import RealTimeHazardMap from './RealTimeHazardMap';

export default function TsunamiMap() {
  return (
    <RealTimeHazardMap
      // Live USGS feed filtered for significant global events over the past 30 days
      apiUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
      getMarkerOptions={(feature) => {
        const props = feature.properties || {};
        
        // Check if the event carries an active tsunami flag warning (1 = Yes, 0 = No)
        const isTsunamiWarning = props.tsunami === 1;
        
        return {
          radius: isTsunamiWarning ? 14 : 7, // Make active threat locations pop out prominently
          fillColor: isTsunamiWarning ? "#2980b9" : "#7f8c8d", // Ocean blue for active, gray for minor/neutralized
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85
        };
      }}
      renderPopupContent={(feature) => {
        const props = feature.properties || {};
        const isTsunamiWarning = props.tsunami === 1;

        return (
          <>
            <h4 className="m-0 font-bold text-base text-slate-900 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
              🌊 Tsunami Event Watch
            </h4>
            <p className="m-0 text-sm font-bold text-blue-600 leading-tight mb-1">
              {props.title || "Seismic Displacement Event"}
            </p>
            <p className="m-0 text-xs text-slate-600 font-medium leading-normal mb-2">
              Region: <span className="font-semibold text-slate-800">{props.place || 'Maritime Grid Zone'}</span>
            </p>

            <div className="text-[10px] bg-slate-50 border border-slate-100 rounded p-1.5 font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Tsunami Threat:</span>
                <span className={`font-bold uppercase ${isTsunamiWarning ? 'text-red-600 animate-pulse' : 'text-slate-500'}`}>
                  {isTsunamiWarning ? '⚠️ ACTIVE WARNING' : 'No Active Threat'}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-0.5">
                <span className="text-slate-500">Trigger Magnitude:</span>
                <b className="text-slate-700">{props.mag || 'N/A'} M</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event Time (UTC):</span>
                <b className="text-slate-700">{props.time ? new Date(props.time).toLocaleDateString() : 'Recent'}</b>
              </div>
            </div>

            {props.url && (
              <a 
                href={props.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-blue-500 hover:underline block mt-2 text-right font-medium"
              >
                Open Official Hydro-Report →
              </a>
            )}
          </>
        );
      }}
    />
  );
}