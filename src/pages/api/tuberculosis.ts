/********************************************************************* 
Author: Sukanta Manna  
Purpose: tuberculosis.ts
**********************************************************************/
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log("🚀 [/api/tuberculosis] Ingesting optimized WHO Tuberculosis incidence indices...");
  
  try {
    // 🌍 Concurrently fetching live TB records alongside the world coordinate framework
    const [whoResponse, geoResponse] = await Promise.all([
      fetch("https://ghoapi.azureedge.net/api/TB_e_inc_num"),
      fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    ]);

    if (!whoResponse.ok || !geoResponse.ok) {
      return new Response(JSON.stringify({ error: "External public health data stream failed" }), { status: 502 });
    }

    const whoData = await whoResponse.json();
    const geoData = await geoResponse.json();

    // 1. Build a lookup registry mapping spatial centroids to explicit names from GeoJSON properties
    const spatialRegistry: Record<string, { coordinates: [number, number]; name: string }> = {};
    
    geoData.features.forEach((feature: any) => {
      const iso3 = feature.id; 
      const textName = feature.properties?.name || iso3; 
      let countryCoords: [number, number] | null = null;

      if (feature.geometry && feature.geometry.type === "Polygon") {
        const coords = feature.geometry.coordinates[0];
        let sumLat = 0, sumLng = 0;
        coords.forEach((c: number[]) => { sumLng += c[0]; sumLat += c[1]; });
        countryCoords = [sumLat / coords.length, sumLng / coords.length];
      } else if (feature.geometry && feature.geometry.type === "MultiPolygon") {
        const firstPolygon = feature.geometry.coordinates[0][0];
        let sumLat = 0, sumLng = 0;
        firstPolygon.forEach((c: number[]) => { sumLng += c[0]; sumLat += c[1]; });
        countryCoords = [sumLat / firstPolygon.length, sumLng / firstPolygon.length];
      }

      if (countryCoords) {
        spatialRegistry[iso3] = {
          coordinates: countryCoords,
          name: textName
        };
      }
    });

    // Precision balancing pinning for core global endemic tracking zones
    if (spatialRegistry["IND"]) spatialRegistry["IND"].coordinates = [20.5937, 78.9629]; // India
    if (spatialRegistry["CHN"]) spatialRegistry["CHN"].coordinates = [35.8617, 104.1954]; // China
    if (spatialRegistry["IDN"]) spatialRegistry["IDN"].coordinates = [-0.7893, 113.9213]; // Indonesia
    if (spatialRegistry["ZAF"]) spatialRegistry["ZAF"].coordinates = [-30.5595, 22.9375]; // South Africa

    // 2. Process, group, and extract the raw data rows
    const records = whoData.value || [];
    const countryLatestData: Record<string, any> = {};

    records.forEach((record: any) => {
      const isCountry = record.SpatialDimType && record.SpatialDimType.toUpperCase() === "COUNTRY";
      if (!isCountry || record.NumericValue === null || record.NumericValue === undefined) return;

      const countryCode = record.SpatialDim;
      const year = parseInt(record.TimeDim) || 0;
      const val = parseFloat(record.NumericValue);

      if (val <= 0) return; // Discard empty tracking footprints

      const geoMatch = spatialRegistry[countryCode];
      if (!geoMatch) return; 

      // Sift chronologically to keep only the absolute latest diagnostic matrix frame per country
      if (!countryLatestData[countryCode] || year > countryLatestData[countryCode].year) {
        countryLatestData[countryCode] = {
          countryCode,
          countryName: geoMatch.name, 
          year,
          tbCases: Math.round(val),
          displayCases: Math.round(val).toLocaleString(),
          coordinates: geoMatch.coordinates
        };
      }
    });

    const cleanedData = Object.values(countryLatestData);
    console.log(`✨ [/api/tuberculosis] Dispatched ${cleanedData.length} structural records.`);

    return new Response(JSON.stringify(cleanedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' 
      }
    });

  } catch (error) {
    console.error("❌ [/api/tuberculosis] Pipeline execution crashed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Fault Sequence" }), { status: 500 });
  }
};