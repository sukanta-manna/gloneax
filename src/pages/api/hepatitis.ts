/********************************************************************* 
Author: Sukanta Manna  
Purpose: hepatitis.ts
**********************************************************************/
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log("🚀 [/api/hepatitis] Ingesting WHO Chronic Hepatitis B Prevalence (HEPATITIS_HBV_PREVALENCE_PER100)...");
  
  try {
    // 🌍 HEPATITIS_HBV_PREVALENCE_PER100 is fully populated and updated by the WHO OData warehouse
    const [whoResponse, geoResponse] = await Promise.all([
      fetch("https://ghoapi.azureedge.net/api/HEPATITIS_HBV_PREVALENCE_PER100"),
      fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    ]);

    if (!whoResponse.ok || !geoResponse.ok) {
      return new Response(JSON.stringify({ error: "External API layer connection timeout" }), { status: 502 });
    }

    const whoData = await whoResponse.json();
    const geoData = await geoResponse.json();

    const records = whoData.value || [];
    console.log(`ℹ️ Received ${records.length} raw data nodes from WHO.`);

    // 1. Build spatial lookup registry
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

    // Pinning balance fixes for hotzones
    if (spatialRegistry["CHN"]) spatialRegistry["CHN"].coordinates = [35.8617, 104.1954];
    if (spatialRegistry["BRA"]) spatialRegistry["BRA"].coordinates = [-14.2350, -51.9253];
    if (spatialRegistry["NGA"]) spatialRegistry["NGA"].coordinates = [9.0820, 8.6753];
    if (spatialRegistry["IND"]) spatialRegistry["IND"].coordinates = [20.5937, 78.9629];

    // 2. Filter, deduplicate and extract latest global entries
    const countryLatestData: Record<string, any> = {};

    records.forEach((record: any) => {
      const isCountry = record.SpatialDimType && record.SpatialDimType.toUpperCase() === "COUNTRY";
      if (!isCountry || record.NumericValue === null || record.NumericValue === undefined) return;

      const countryCode = record.SpatialDim;
      const year = parseInt(record.TimeDim) || 0;
      const val = parseFloat(record.NumericValue);

      if (val <= 0) return; 

      const geoMatch = spatialRegistry[countryCode];
      if (!geoMatch) return; 

      if (!countryLatestData[countryCode] || year > countryLatestData[countryCode].year) {
        countryLatestData[countryCode] = {
          countryCode,
          countryName: geoMatch.name, 
          year,
          hepatitisCases: val, // Stores prevalence float (e.g., 3.4)
          displayCases: `${val.toFixed(1)}%`,
          coordinates: geoMatch.coordinates
        };
      }
    });

    const cleanedData = Object.values(countryLatestData);
    console.log(`✨ [/api/hepatitis] Dispatched ${cleanedData.length} records into Map layer view.`);

    return new Response(JSON.stringify(cleanedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' 
      }
    });

  } catch (error) {
    console.error("❌ [/api/hepatitis] Fatal connection pipeline error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Fault Sequence" }), { status: 500 });
  }
};