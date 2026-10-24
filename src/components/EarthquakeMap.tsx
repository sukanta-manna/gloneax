/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show earthquakes on the global map with structured card popups.
**********************************************************************/
import React from 'react';
import RealTimeHazardMap from './RealTimeEarthquakeMap';
import L from 'leaflet';

const popupAndMarkerStyles = `
.leaflet-div-icon {
  background: transparent !important;
  border: none !important;
}

@keyframes shockwave-pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.marker-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shockwave-ring {
  position: absolute;
  inset: 0;
  animation: shockwave-pulse 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
  pointer-events: none;
}

/* Custom Leaflet Popup Styling to match card UI */
.leaflet-popup-content-wrapper {
  padding: 0 !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}

.leaflet-popup-content {
  margin: 0 !important;
  line-height: 1.4 !important;
}

.leaflet-popup-close-button {
  color: #ffffff !important;
  top: 10px !important;
  right: 10px !important;
  font-size: 16px !important;
  z-index: 10 !important;
}
`;

export default function EarthquakeMap() {
  return (
    <>
      <style>{popupAndMarkerStyles}</style>

      <RealTimeHazardMap
        apiUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        overlayUrl="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
        overlayStyle={{
          color: "#dc2626",
          weight: 1.8,
          opacity: 0.85,
        }}
        pointToLayer={(feature, latlng) => {
          const mag = feature.properties.mag || 0;

          let bgColor = "#dc2626"; // Major (Red)
          if (mag < 3.0) bgColor = "#16a34a"; // Minor (Green)
          else if (mag < 5.0) bgColor = "#d97706"; // Moderate (Amber)

          const iconSize = Math.max(Math.round(mag * 6), 22);
          const borderRadius = Math.round(iconSize * 0.35);

          const customIcon = L.divIcon({
            className: '',
            iconSize: [iconSize, iconSize],
            iconAnchor: [iconSize / 2, iconSize / 2],
            popupAnchor: [0, -iconSize / 2],
            html: `
              <div class="marker-container">
                <div class="shockwave-ring" style="
                  background-color: ${bgColor};
                  border-radius: ${borderRadius}px;
                "></div>
                <div style="
                  position: relative;
                  z-index: 2;
                  width: ${iconSize}px;
                  height: ${iconSize}px;
                  background-color: ${bgColor};
                  border-radius: ${borderRadius}px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
                ">
                  <div style="
                    width: ${Math.round(iconSize * 0.45)}px;
                    height: ${Math.round(iconSize * 0.45)}px;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    box-sizing: border-box;
                  "></div>
                </div>
              </div>
            `,
          });

          return L.marker(latlng, { icon: customIcon });
        }}
        renderPopupContent={(feature) => {
          const props = feature.properties || {};
          const coords = feature.geometry?.coordinates || [0, 0, 0];

          // GeoJSON coordinates are [longitude, latitude, depth]
          const longitude = coords[0] !== undefined ? coords[0].toFixed(3) : 'N/A';
          const latitude = coords[1] !== undefined ? coords[1].toFixed(3) : 'N/A';
          const depth = coords[2] !== undefined ? `${coords[2]} km` : 'N/A';

          const mag = props.mag ?? 0;

          // Calculate approximate rupture zone radius in km using empirical scaling
          const radiusKm = mag > 0 ? Math.pow(10, (0.5 * mag) - 1.8).toFixed(1) : 'N/A';

          const sourceUrl = props.url || 'https://earthquake.usgs.gov/';

          return (
            <div className="w-[300px] font-sans bg-white overflow-hidden text-slate-800">
              {/* Header Badge Section */}
              <div className="bg-[#0f172a] text-white px-3.5 py-3 flex items-center justify-between border-b border-slate-800">
                <span className="font-extrabold tracking-wider text-xs uppercase">
                  EPICENTER
                </span>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase transition-colors"
                >
                  USGS_DATA ↗
                </a>
              </div>

              {/* Data Table Grid */}
              <div className="divide-y divide-slate-100 text-xs">
                {/* MAGNITUDE */}
                <div className="grid grid-cols-[110px_1fr] items-center px-3.5 py-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    MAGNITUDE
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {mag}
                  </span>
                </div>

                {/* LOCATION */}
                <div className="grid grid-cols-[110px_1fr] items-center px-3.5 py-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    LOCATION
                  </span>
                  <span className="font-bold text-slate-900 leading-tight">
                    {props.place || 'Unknown'}
                  </span>
                </div>

                {/* GEO-CORDINATE */}
                <div className="grid grid-cols-[110px_1fr] items-center px-3.5 py-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    GEO-CORDINATE
                  </span>
                  <span className="font-semibold text-slate-800">
                    {latitude}°, {longitude}°
                  </span>
                </div>

                {/* DEPTH */}
                <div className="grid grid-cols-[110px_1fr] items-center px-3.5 py-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    DEPTH
                  </span>
                  <span className="font-semibold text-slate-800">
                    {depth}
                  </span>
                </div>

                {/* DATE */}
                <div className="grid grid-cols-[110px_1fr] items-center px-3.5 py-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    DATE & TIME
                  </span>
                  <span className="font-semibold text-slate-800 leading-tight">
                    {props.time ? new Date(props.time).toLocaleString() : 'N/A'}
                  </span>
                </div>

                {/* RADIUS IN KM */}
                <div className="grid grid-cols-[110px_1fr] items-center px-3.5 py-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    RADIUS
                  </span>
                  <span className="font-semibold text-slate-800">
                    ~{radiusKm} km
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      />
    </>
  );
}