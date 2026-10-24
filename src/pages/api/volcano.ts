/********************************************************************* 
Author: Sukanta Manna  
Purpose: volcano.ts
**********************************************************************/
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log("🚀 [/api/volcano] Ingesting optimized Holocene Volcano Registry via fast GitHub CDN...");

  try {
    // 🌍 High-availability, zero-firewall public data mirror mapping official GVP data structures
    const response = await fetch(
      "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-05-12/volcano.csv"
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to download backup volcano matrix" }), { status: 502 });
    }

    const csvText = await response.text();
    
    // Simple, reliable server-side CSV line parser 
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    // Find index of essential keys dynamically
    const idxNum = headers.indexOf('volcano_number');
    const idxName = headers.indexOf('volcano_name');
    const idxCountry = headers.indexOf('country');
    const idxType = headers.indexOf('primary_volcano_type');
    const idxLat = headers.indexOf('latitude');
    const idxLng = headers.indexOf('longitude');
    const idxElev = headers.indexOf('elevation');
    const idxErupt = headers.indexOf('last_known_eruption_year');

    const cleanedData = [];

    for (let i = 1; i < lines.length; i++) {
      // Regex handling to accurately ignore commas within enclosed quotes
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (row.length < headers.length) continue;

      const lat = parseFloat(row[idxLat]);
      const lng = parseFloat(row[idxLng]);
      
      if (isNaN(lat) || isNaN(lng)) continue;

      // Unquote strings safely
      const cleanString = (val: string) => val?.replace(/^"|"$/g, '').trim() || "";

      cleanedData.push({
        id: cleanString(row[idxNum]) || `v-${i}`,
        volcanoName: cleanString(row[idxName]) || "Active Volcano",
        country: cleanString(row[idxCountry]) || "Unknown Location",
        type: cleanString(row[idxType]) || "Holocene Volcano",
        elevation: `${Math.round(parseFloat(row[idxElev]) || 0)}m`,
        lastEruption: cleanString(row[idxErupt]) === "Unknown" ? "Holocene Epoch" : `Year ${cleanString(row[idxErupt])}`,
        coordinates: [lat, lng] as [number, number]
      });
    }

    console.log(`✨ [/api/volcano] Successfully built and broadcasted ${cleanedData.length} records without timeouts.`);

    return new Response(JSON.stringify(cleanedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1200' // Highly static dataset cached for 20 minutes
      }
    });

  } catch (error) {
    console.error("❌ [/api/volcano] Internal dataset reconstruction failure:", error);
    return new Response(JSON.stringify({ error: "Dataset compilation failure sequence" }), { status: 500 });
  }
};