/********************************************************************* 
Author: Sukanta Manna  
Purpose: wildfires.ts
**********************************************************************/
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // 🌟 Using NASA's EONET Open Web API for Active Wildfire coordinates
    const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open");
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `NASA EONET responded with status: ${response.status}` }), 
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const eonetData = await response.json();

    // 🌟 Format the EONET event object matrix into an exact GeoJSON FeatureCollection
    const geojson = {
      type: "FeatureCollection",
      features: (eonetData.events || []).map((event: any) => {
        // Grab the latest telemetry point coordinate array (EONET places newest points first)
        const geometry = event.geometry && event.geometry[0];
        
        return {
          type: "Feature",
          id: event.id,
          geometry: {
            type: geometry?.type || "Point",
            coordinates: geometry?.coordinates || [0, 0] // [longitude, latitude]
          },
          properties: {
            place: event.title,
            time: geometry?.date || new Date().toISOString(),
            link: event.sources && event.sources[0]?.url || "",
            confidence: "Satellite Verified"
          }
        };
      })
    };
    
    return new Response(JSON.stringify(geojson), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600" // Cache local proxy results for 60 minutes
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: "Failed to parse hazard telemetry stream", details: errorMessage }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}