import type { APIRoute } from "astro"

const GLOBAL_WATCHPOINTS = [
  { name: "Miami", lat: 25.7617, lon: -80.1918 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Manila", lat: 14.5995, lon: 120.9842 },
  { name: "New Orleans", lat: 29.9511, lon: -90.0715 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Bay of Bengal", lat: 15.0, lon: 88.0 },
  { name: "Caribbean Basin", lat: 17.5, lon: -75.0 },
  { name: "Oklahoma City", lat: 35.4676, lon: -97.5164 },
  { name: "Madagascar", lat: -18.7669, lon: 46.8691 },
]

export const GET: APIRoute = async () => {
  // Access key securely on the server
  const apiKey =
    process.env.OPENWEATHER_API_KEY || import.meta.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing OpenWeather API key on server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  try {
    let tstorms = 0
    let highWinds = 0
    let cyclones = 0
    let extremePrecip = 0

    const requests = GLOBAL_WATCHPOINTS.map(async (point) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat}&lon=${point.lon}&appid=${apiKey}&units=metric`
      )
      if (!res.ok) return null
      return res.json()
    })

    const results = await Promise.all(requests)

    const validResults = results.filter(Boolean)

    validResults.forEach((data) => {
      const weatherId = data.weather?.[0]?.id || 800
      const windSpeedKmh = (data.wind?.speed || 0) * 3.6

      if (weatherId >= 200 && weatherId < 300) tstorms++
      if (windSpeedKmh >= 30) highWinds++
      if (windSpeedKmh >= 65 || weatherId === 781 || weatherId === 959)
        cyclones++
      if ((weatherId >= 502 && weatherId <= 531) || weatherId === 771)
        extremePrecip++
    })

    const payload = {
      thunderstorms: tstorms,
      highWinds: highWinds,
      tropicalCyclones: cyclones,
      extremePrecipitation: extremePrecip,
      totalTrackedPoints: validResults.length,
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300", // Cache for 5 mins to prevent hitting rate limits
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to stream weather telemetry" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
