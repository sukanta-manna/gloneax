/********************************************************************* 
Author: Sukanta Manna  
Purpose: mumps.ts
**********************************************************************/
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log("🚀 [/api/mumps] Ingesting optimized WHO Mumps indicators (WHS3_43) and geographic maps...");
  
  try {
    // 🌍 Fetching both data components concurrently (Using WHS3_43 for active Mumps rows)
    const [whoResponse, geoResponse] = await Promise.all([
      fetch("https://ghoapi.azureedge.net/api/WHS3_43"),
      fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    ]);

    if (!whoResponse.ok || !geoResponse.ok) {
      return new Response(JSON.stringify({ error: "External data dependency failed" }), { status: 502 });
    }

    const whoData = await whoResponse.json();
   
    const geoData = await geoResponse.json();

    // 1. Build a lookup registry that catches BOTH coordinates and English names from GeoJSON
    const spatialRegistry: Record<string, { coordinates: [number, number]; name: string }> = {};
    
    geoData.features.forEach((feature: any) => {
      const iso3 = feature.id; 
      const textName = feature.properties?.name || iso3; // 🌟 Pulls the explicit name directly!
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

    // Manual pinning adjustments for centered visual balancing over primary map regions
    if (spatialRegistry["BRA"]) spatialRegistry["BRA"].coordinates = [-14.2350, -51.9253]; 
    if (spatialRegistry["NGA"]) spatialRegistry["NGA"].coordinates = [9.0820, 8.6753];    
    if (spatialRegistry["COD"]) spatialRegistry["COD"].coordinates = [-4.0383, 21.7587];   

    // 2. Process, group, and filter the raw WHO records
    const records = whoData.value || [];
    const countryLatestData: Record<string, any> = {};

    records.forEach((record: any) => {
      const isCountry = record.SpatialDimType && record.SpatialDimType.toUpperCase() === "COUNTRY";
      if (!isCountry || record.NumericValue === null || record.NumericValue === undefined) return;

      const countryCode = record.SpatialDim;
      const year = parseInt(record.TimeDim) || 0;
      const val = parseFloat(record.NumericValue);

      // Filter out zero-case lines to keep your map canvas layout optimized and clean
      if (val <= 0) return;

      const hasGenderDimension = record.Dim1 || record.Dim2 || record.Dim3;
      if (hasGenderDimension) {
        const isBothSexes = 
          record.Dim1 === "BTSX" || record.Dim1 === "Both sexes" ||
          record.Dim2 === "BTSX" || record.Dim3 === "BTSX";
        if (!isBothSexes && (record.Dim1 === "MLE" || record.Dim1 === "FMLE")) return;
      }

      const geoMatch = spatialRegistry[countryCode];
      if (!geoMatch) return; // Skip if untrackable on map canvas

      // De-duplicate by keeping the most recent active data year per country
      if (!countryLatestData[countryCode] || year > countryLatestData[countryCode].year) {
        countryLatestData[countryCode] = {
          countryCode,
          countryName: geoMatch.name, // 🌟 Clean string text bound securely here from GeoJSON properties!
          year,
          cases: Math.round(val), // Updated data property key to properly reflect mumps context
          coordinates: geoMatch.coordinates
        };
      }
    });

    const cleanedData = Object.values(countryLatestData);
    console.log(`✨ [/api/mumps] Dispatched ${cleanedData.length} records. Example layout:`, JSON.stringify(cleanedData[0]));

    return new Response(JSON.stringify(cleanedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' 
      }
    });

  } catch (error) {
    console.error("❌ [/api/mumps] Pipeline Failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};