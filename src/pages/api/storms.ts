import type { APIRoute } from 'astro';

const API_KEY = process.env.OPENWEATHER_API_KEY || "4fae8b4424164c09ff6f9482a64467fa";

// Key global storm watch locations (Latitude, Longitude, City Name)
const WATCHPOINTS = [
  { name: "Miami (Atlantic Basin)", lat: 25.7617, lon: -80.1918 },
  { name: "Tokyo (Pacific Basin)", lat: 35.6762, lon: 139.6503 },
  { name: "Manila (Typhoon Zone)", lat: 14.5995, lon: 120.9842 },
  { name: "New Orleans (Gulf Coast)", lat: 29.9511, lon: -90.0715 },
  { name: "Sydney (South Pacific)", lat: -33.8688, lon: 151.2093 },
  { name: "Bay of Bengal Watch", lat: 15.0, lon: 88.0 },
  { name: "Caribbean Basin Watch", lat: 17.5, lon: -75.0 },
];

export const GET: APIRoute = async () => {
  try {
    const features = await Promise.all(
      WATCHPOINTS.map(async (point) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat}&lon=${point.lon}&appid=${API_KEY}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();

        // Wind speed is returned in meters/second -> convert to km/h
        const windSpeedKmh = Math.round((data.wind?.speed || 0) * 3.6);

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [data.coord.lon, data.coord.lat],
          },
          properties: {
            title: `${data.name || point.name} Weather System`,
            place: `${data.name}, ${data.sys?.country || 'Ocean Grid'}`,
            windSpeedKmh: windSpeedKmh,
            humidity: data.main?.humidity,
            pressure: data.main?.pressure,
            temp: data.main?.temp,
            condition: data.weather?.[0]?.description || "Atmospheric monitoring",
            icon: data.weather?.[0]?.icon,
            time: data.dt ? data.dt * 1000 : Date.now(),
          },
        };
      })
    );

    const validFeatures = features.filter(Boolean);

    return new Response(
      JSON.stringify({
        type: "FeatureCollection",
        features: validFeatures,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch OpenWeatherMap data" }),
      { status: 500 }
    );
  }
};