/********************************************************************* 
Author: Sukanta Manna   
Purpose: childMortality.ts
**********************************************************************/
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const GET: APIRoute = async () => {
  //console.log("🚀 [/api/childMortality] Ingesting local Child Mortality datasets and world geoJSON mapping...");

  try {
    // 1. Fetch world spatial configurations for geographic projection
    const geoResponse = await fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json");

    if (!geoResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to resolve world geoJSON spatial configurations" }), { status: 502 });
    }

    const geoData = await geoResponse.json();

    // 2. Read the locally uploaded childMortality.json file from /public/ml/Child_Mortality_Data/
    const jsonPath = path.join(process.cwd(), 'public', 'ml', 'Child_Mortality_Data', 'childMortality.json');

    if (!fs.existsSync(jsonPath)) {
    //  console.error(`❌ Local file not found at path: ${jsonPath}`);
      return new Response(JSON.stringify({ error: "Local child mortality dataset file not found" }), { status: 404 });
    }

    const fileContents = fs.readFileSync(jsonPath, 'utf-8');
    const localMortalityData: Record<string, Record<string, number>> = JSON.parse(fileContents);

    // 3. Build a lookup registry capturing coordinates AND plain-text English country names directly
    const spatialRegistry: Record<string, { coordinates: [number, number]; name: string }> = {};

    geoData.features.forEach((feature: any) => {
      const iso3 = feature.id; // e.g., "IND", "NGA"
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

    // Manual pinning adjustments for visually balanced placement on the map canvas
    if (spatialRegistry["USA"]) spatialRegistry["USA"].coordinates = [37.0902, -95.7129];
    if (spatialRegistry["CAN"]) spatialRegistry["CAN"].coordinates = [56.1304, -106.3468];
    if (spatialRegistry["CHN"]) spatialRegistry["CHN"].coordinates = [35.8617, 104.1954];

    // 4. Process the local JSON records: extract the latest recorded year & value per ISO code
    const cleanedData: Array<{
      countryCode: string;
      countryName: string;
      year: number;
      mortalityRate: number;
      coordinates: [number, number];
    }> = [];

    Object.entries(localMortalityData).forEach(([countryCode, yearlyRecords]) => {
      const geoMatch = spatialRegistry[countryCode];
      if (!geoMatch) return; // Skip if country cannot be projected on map

      const years = Object.keys(yearlyRecords)
        .map((y) => parseInt(y, 10))
        .filter((y) => !isNaN(y))
        .sort((a, b) => b - a); // Sort descending to get the latest year

      if (years.length === 0) return;

      const latestYear = years[0];
      const rate = yearlyRecords[latestYear.toString()];

      if (rate !== undefined && rate !== null) {
        cleanedData.push({
          countryCode,
          countryName: geoMatch.name,
          year: latestYear,
          mortalityRate: Math.round(rate * 10) / 10,
          coordinates: geoMatch.coordinates
        });
      }
    });

    return new Response(JSON.stringify(cleanedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
   // console.error("❌ [/api/childMortality] Pipeline processing failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};