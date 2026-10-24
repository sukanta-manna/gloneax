export const prerender = false;

import type { APIRoute } from 'astro';
import { sendEarthquakeAlert } from '@/lib/telegram';

const notifiedIds = new Set<string>();

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = import.meta.env.CRON_SECRET || process.env.CRON_SECRET;

  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson'
    );
    const data = await response.json();

    // Use live USGS data, or generate 1 mock event if no real 4.5+ earthquakes occurred in the last hour
    const features = data.features || [];

    let alertsSent = 0;
    const TEN_MINUTES_AGO = Date.now() - 10 * 60 * 1000;
    for (const feature of features) {
      const eqId = feature.id;
      const eventTime = feature.properties.time;

      if (eventTime < TEN_MINUTES_AGO || notifiedIds.has(eqId)) continue;

      const event = {
        id: eqId,
        magnitude: feature.properties.mag,
        place: feature.properties.place,
        time: feature.properties.time,
        url: feature.properties.url,
        coordinates: feature.geometry.coordinates,
      };

      await sendEarthquakeAlert(event);
      notifiedIds.add(eqId);
      alertsSent++;
    }

    return new Response(
      JSON.stringify({ status: 'ok', processed: features.length, alertsSent }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Cron job error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process job' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

