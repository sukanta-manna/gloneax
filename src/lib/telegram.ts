export async function sendEarthquakeAlert(event: {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  url: string;
  coordinates: number[];
}) {
  const TELEGRAM_BOT_TOKEN =
    import.meta.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID =
    import.meta.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram credentials are missing in environment variables.');
  }

  const dateStr = new Date(event.time).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  const text =
    `🚨 *EARTHQUAKE ALERT* 🚨\n\n` +
    `*Magnitude:* ${event.magnitude}\n` +
    `*Location:* ${event.place}\n` +
    `*Time:* ${dateStr}\n` +
    `[View USGS Report](${event.url})`;

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    }
  );

  return res.json();
}