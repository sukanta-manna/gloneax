/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show real storm & weather telemetry using OpenWeatherMap.
**********************************************************************/
import RealTimeHazardMap from './RealTimeHazardMap';

export default function GlobalStormMap() {
  return (
    <RealTimeHazardMap
      // Point to your local API proxy endpoint that formats OpenWeatherMap data
      apiUrl="/api/storms"
      getMarkerOptions={(feature) => {
        const windSpeed = feature.properties?.windSpeedKmh || 0;

        // Color code based on wind speed thresholds (Tropical Disturbance -> Storm -> Severe Storm)
        let color = "#3498db"; // Normal / Moderate (< 30 km/h)
        let radius = 6;

        if (windSpeed >= 60) {
          color = "#e74c3c"; // Severe Storm (> 60 km/h)
          radius = 12;
        } else if (windSpeed >= 35) {
          color = "#e67e22"; // Moderate Wind / Squall (35-60 km/h)
          radius = 9;
        }

        return {
          radius: radius,
          fillColor: color,
          color: "#ffffff",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.8,
        };
      }}
      renderPopupContent={(feature) => {
        const props = feature.properties || {};

        const formattedDate = props.time
          ? new Date(props.time).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : 'Recent';

        return (
          <>
            <h4 className="m-0 font-bold text-base text-slate-900 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
              🌀 Atmospheric Vector
            </h4>
            <p className="m-0 text-sm font-bold text-indigo-600 capitalize leading-tight mb-1">
              {props.condition || "Weather Disturbance"}
            </p>
            <p className="m-0 text-xs text-slate-600 font-medium leading-normal mb-2">
              Station Location: <span className="font-semibold text-slate-800">{props.place}</span>
            </p>

            <div className="text-[10px] bg-slate-50 border border-slate-100 rounded p-1.5 text-slate-600 font-mono space-y-1">
              <div className="flex justify-between">
                <span>Wind Speed:</span>
                <b className="text-slate-800">{props.windSpeedKmh} km/h</b>
              </div>
              <div className="flex justify-between">
                <span>Temperature:</span>
                <b className="text-slate-800">{props.temp}°C</b>
              </div>
              <div className="flex justify-between">
                <span>Pressure / Humidity:</span>
                <b className="text-slate-800">{props.pressure} hPa | {props.humidity}%</b>
              </div>
              <div className="border-t border-slate-200 pt-1 text-[9px] text-slate-400">
                Log Time: {formattedDate}
              </div>
            </div>
          </>
        );
      }}
    />
  );
}