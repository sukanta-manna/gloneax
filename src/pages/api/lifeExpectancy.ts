/********************************************************************* 
Author: Sukanta Manna  
Purpose: lifeExpectancy.ts
**********************************************************************/
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log("🚀 [/api/lifeExpectancy] Ingesting optimized WHO Life Expectancy indicators and geographic maps...");
  
  try {
    // 🌍 Fetching both data components concurrently
    const [whoResponse, geoResponse] = await Promise.all([
      fetch("https://ghoapi.azureedge.net/api/WHOSIS_000001"),
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

    // Manual pinning adjustments for centered visual balancing
    if (spatialRegistry["USA"]) spatialRegistry["USA"].coordinates = [37.0902, -95.7129];
    if (spatialRegistry["CAN"]) spatialRegistry["CAN"].coordinates = [56.1304, -106.3468];
    if (spatialRegistry["CHN"]) spatialRegistry["CHN"].coordinates = [35.8617, 104.1954];

    // 2. Process, group, and filter the raw WHO records
    const records = whoData.value || [];
    const countryLatestData: Record<string, any> = {};

    records.forEach((record: any) => {
      const isCountry = record.SpatialDimType && record.SpatialDimType.toUpperCase() === "COUNTRY";
      if (!isCountry || record.NumericValue === null || record.NumericValue === undefined) return;

      const countryCode = record.SpatialDim;
      const year = parseInt(record.TimeDim) || 0;
      const val = parseFloat(record.NumericValue);

      const hasGenderDimension = record.Dim1 || record.Dim2 || record.Dim3;
      if (hasGenderDimension) {
        const isBothSexes = 
          record.Dim1 === "BTSX" || record.Dim1 === "Both sexes" ||
          record.Dim2 === "BTSX" || record.Dim3 === "BTSX";
        if (!isBothSexes && (record.Dim1 === "MLE" || record.Dim1 === "FMLE")) return;
      }

      const geoMatch = spatialRegistry[countryCode];
      if (!geoMatch) return; // Skip if untrackable on map canvas

      if (!countryLatestData[countryCode] || year > countryLatestData[countryCode].year) {
        countryLatestData[countryCode] = {
          countryCode,
          countryName: geoMatch.name, // 🌟 Clean string text bound securely here
          year,
          lifeExpectancy: Math.round(val * 10) / 10,
          coordinates: geoMatch.coordinates
        };
      }
    });

    const cleanedData = Object.values(countryLatestData);
    console.log(`✨ [/api/lifeExpectancy] Dispatched ${cleanedData.length} records. Example layout:`, JSON.stringify(cleanedData[10]));

    return new Response(JSON.stringify(cleanedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
    console.error("❌ [/api/lifeExpectancy] Pipeline Failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};