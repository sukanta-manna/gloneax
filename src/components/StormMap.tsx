/********************************************************************* 
Author: Sukanta Manna  
Purpose: Fetch storm data using public API.
**********************************************************************/
import RealTimeHazardMap from './RealTimeHazardMap';

export default function StormMap() {
    return (
        <RealTimeHazardMap
            // Public NOAA endpoint for ALL active severe weather watches, warnings, and tracks
            //apiUrl="https://api.weather.gov/alerts/active"
            apiUrl="https://openweathermap.org/api"
            getMarkerOptions={(feature) => {
                const eventType = feature.properties.event?.toLowerCase() || '';

                let strokeColor = "#3498db"; // Default Storm Blue
                let fillOpacity = 0.4;

                if (eventType.includes('tornado')) {
                    strokeColor = "#e74c3c"; // Crimson Red for Tornadoes
                    fillOpacity = 0.65;
                } else if (eventType.includes('hurricane') || eventType.includes('typhoon') || eventType.includes('cyclone')) {
                    strokeColor = "#9b59b6"; // Amethyst Purple for Cyclones/Hurricanes
                    fillOpacity = 0.6;
                } else if (eventType.includes('thunderstorm') || eventType.includes('gale')) {
                    strokeColor = "#e67e22"; // Flame Orange for Severe Storms/Gales
                    fillOpacity = 0.45;
                }

                return {
                    radius: 6, // In case any localized events present as single points
                    fillColor: strokeColor,
                    color: strokeColor,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: fillOpacity
                };
            }}
            renderPopupContent={(feature) => (
                <>
                    <h4 className="m-0 font-bold text-base text-slate-900 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
                        🚨 Severe Weather Alert
                    </h4>
                    <p className="m-0 text-sm font-bold text-red-600 leading-tight mb-1">
                        {feature.properties.event || "Active Weather Warning"}
                    </p>
                    <p className="m-0 text-xs text-slate-600 leading-normal font-medium mb-2 max-h-20 overflow-y-auto pr-1">
                        {feature.properties.headline || "Take necessary safety tracking precautions."}
                    </p>
                    <div className="text-[10px] bg-slate-50 border border-slate-100 rounded p-1 text-slate-500 font-mono">
                        <span className="block">Severity: <b className="text-slate-700">{feature.properties.severity || 'Unknown'}</b></span>
                        <span className="block mt-0.5">Expires: {feature.properties.expires ? new Date(feature.properties.expires).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                </>
            )}
        />
    );
}