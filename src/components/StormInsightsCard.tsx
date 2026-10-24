/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show statistics on storms using OpenWeatherMap live telemetry.
**********************************************************************/
import React, { useEffect, useState } from 'react';

interface LiveStormCounts {
  thunderstorms: number;
  highWinds: number;
  tropicalCyclones: number;
  extremePrecipitation: number;
  totalTrackedPoints: number;
}

export default function StormInsightsCard() {
  const [counts, setCounts] = useState<LiveStormCounts>({
    thunderstorms: 0,
    highWinds: 0,
    tropicalCyclones: 0,
    extremePrecipitation: 0,
    totalTrackedPoints: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchServerTelemetry() {
      try {
        const res = await fetch('/api/storm-insights');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setCounts({
          thunderstorms: Number(data.thunderstorms) || 0,
          highWinds: Number(data.highWinds) || 0,
          tropicalCyclones: Number(data.tropicalCyclones) || 0,
          extremePrecipitation: Number(data.extremePrecipitation) || 0,
          totalTrackedPoints: Number(data.totalTrackedPoints) || 0,
        });

        setError(false);
      } catch (err) {
        console.error('Failed to fetch telemetry from server endpoint:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchServerTelemetry();
    const interval = setInterval(fetchServerTelemetry, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  // Compute total active weather events detected across watchpoints
  const totalEvents =
    counts.thunderstorms +
    counts.highWinds +
    counts.tropicalCyclones +
    counts.extremePrecipitation;

  // Safe percentage calculation to prevent division by zero (NaN)
  const calcPct = (val: number) =>
    totalEvents > 0 ? Math.round((val / totalEvents) * 100) : 0;

  const tstormPct = calcPct(counts.thunderstorms);
  const windPct = calcPct(counts.highWinds);
  const cyclonePct = calcPct(counts.tropicalCyclones);
  const precipPct = calcPct(counts.extremePrecipitation);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🌀</span> Live Storm & Atmospheric Telemetry
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time active weather patterns streamed via OpenWeatherMap
          </p>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-xs text-slate-400 font-medium animate-pulse">
              Streaming...
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed Active
            </span>
          )}
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl">
          ⚠️ Unable to fetch live OpenWeatherMap telemetry. Retrying automatically...
        </div>
      ) : (
        <>
          {/* Main KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            
            {/* KPI 1: Thunderstorms */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Thunderstorms
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500">
                  {counts.thunderstorms}
                </span>
                <span className="text-xs text-slate-400 font-medium">active zones</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${tstormPct}%` }}
                />
              </div>
            </div>

            {/* KPI 2: High Winds */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                High Winds (&gt;30 km/h)
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-500">
                  {counts.highWinds}
                </span>
                <span className="text-xs text-slate-400 font-medium">active zones</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${windPct}%` }}
                />
              </div>
            </div>

            {/* KPI 3: Extreme Rain & Squalls */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Heavy Rain / Squalls
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-600 dark:text-rose-500">
                  {counts.extremePrecipitation}
                </span>
                <span className="text-xs text-slate-400 font-medium">active zones</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${precipPct}%` }}
                />
              </div>
            </div>

            {/* KPI 4: Cyclones & Severe Gales */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Severe Cyclonic Gales
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {counts.tropicalCyclones}
                </span>
                <span className="text-xs text-slate-400 font-medium">tracked systems</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${cyclonePct}%` }}
                />
              </div>
            </div>

          </div>

          {/* Visual Distribution Infographic Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Live Condition Breakdown
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {counts.totalTrackedPoints} Global Watchpoints Active
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-0.5">
              <div
                title="Thunderstorms"
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${tstormPct}%` }}
              />
              <div
                title="High Winds"
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${windPct}%` }}
              />
              <div
                title="Heavy Rain"
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${precipPct}%` }}
              />
              <div
                title="Severe Gales"
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${cyclonePct}%` }}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Thunderstorms ({tstormPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>High Winds ({windPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Heavy Rain ({precipPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Severe Gales ({cyclonePct}%)</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}