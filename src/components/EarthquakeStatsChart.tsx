/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show statistics on Earthquakes using dynamic Plotly.js (SSR safe).
**********************************************************************/
import React, { useEffect, useState, useRef } from 'react';

interface YearlyStat {
  year: number;
  count: number;
}

const FALLBACK_DATA: YearlyStat[] = [
  { year: 2017, count: 12668 },
  { year: 2018, count: 16023 },
  { year: 2019, count: 15351 },
  { year: 2020, count: 15411 },
  { year: 2021, count: 13113 },
  { year: 2022, count: 14614 },
  { year: 2023, count: 13555 },
  { year: 2024, count: 13967 },
  { year: 2025, count: 17297 },
  { year: 2026, count: 11200 },
];

export default function EarthquakeStatsChart() {
  const [data, setData] = useState<YearlyStat[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUSGSYearlyStats() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 9;
      const years = Array.from({ length: 10 }, (_, i) => startYear + i);

      try {
        const results = await Promise.all(
          years.map(async (year) => {
            const res = await fetch(
              `https://earthquake.usgs.gov/fdsnws/event/1/count?starttime=${year}-01-01&endtime=${year}-12-31&minmagnitude=4.5`
            );
            const count = await res.json();
            return { year, count: typeof count === 'number' ? count : 0 };
          })
        );

        if (results.every((item) => item.count > 0)) {
          setData(results);
        }
      } catch (err) {
        console.warn("USGS API fetch failed, falling back to static baseline:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUSGSYearlyStats();
  }, []);

  // Dynamically import Plotly on the client side only
  useEffect(() => {
    if (!chartContainerRef.current) return;

    let isMounted = true;

    async function renderChart() {
      // Dynamic import prevents Node.js from running Plotly code during SSR
      const Plotly = (await import('plotly.js-dist-min')).default;

      if (!isMounted || !chartContainerRef.current) return;

      const isDark = document.documentElement.classList.contains('dark');
      const years = data.map((d) => d.year);
      const counts = data.map((d) => d.count);

      const maxVal = Math.max(...counts, 1000);
      const yMax = Math.ceil((maxVal + 1000) / 1000) * 1000;

      const plotData: any[] = [
        {
          x: years,
          y: counts,
          type: 'bar',
          marker: {
            color: '#f43f5e',
          },
          hoverlabel: {
            bgcolor: '#e11d48',
            font: { color: '#ffffff' },
          },
          hovertemplate: '<b>%{x}</b><br>Quakes: <b>%{y:,}</b><extra></extra>',
        },
      ];

      const layout: any = {
        autosize: true,
        margin: { l: 55, r: 20, t: 20, b: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: {
          family: 'ui-sans-serif, system-ui, sans-serif',
          color: isDark ? '#94a3b8' : '#64748b',
          size: 11,
        },
        xaxis: {
          type: 'category',
          tickangle: 0,
          gridcolor: 'transparent',
          showline: false,
          zeroline: false,
        },
        yaxis: {
          dtick: 1000,
          range: [0, yMax],
          gridcolor: isDark ? '#1e293b' : '#f1f5f9',
          zerolinecolor: isDark ? '#334155' : '#e2e8f0',
          tickformat: ',d',
        },
      };

      const config: any = {
        responsive: true,
        displayModeBar: false,
      };

      Plotly.newPlot(chartContainerRef.current, plotData, layout, config);
    }

    renderChart();

    return () => {
      isMounted = false;
      if (chartContainerRef.current) {
        import('plotly.js-dist-min').then((Plotly) => {
          if (chartContainerRef.current) {
            Plotly.default.purge(chartContainerRef.current);
          }
        });
      }
    };
  }, [data]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Global Earthquake Activity (10-Year Trend)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Annual count of global earthquakes ≥ M4.5 sourced from the USGS API
          </p>
        </div>

        {loading && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Syncing USGS telemetry...
          </span>
        )}
      </div>

      <div ref={chartContainerRef} className="h-72 w-full" />
    </div>
  );
}


/********************************************************************* 
Author: Sukanta Manna  
Purpose: Show statistics on the Earthquake.
**********************************************************************/
/*
import React, { useEffect, useState } from 'react';

interface YearlyStat {
  year: number;
  count: number;
}

// Fallback historical USGS numbers (M4.5+ earthquakes globally)
const FALLBACK_DATA: YearlyStat[] = [
  { year: 2016, count: 14850 },
  { year: 2017, count: 12668 },
  { year: 2018, count: 16023 },
  { year: 2019, count: 15351 },
  { year: 2020, count: 15411 },
  { year: 2021, count: 13113 },
  { year: 2022, count: 14614 },
  { year: 2023, count: 13555 },
  { year: 2024, count: 13967 },
  { year: 2025, count: 17297 },
];

export default function EarthquakeStatsChart() {
  const [data, setData] = useState<YearlyStat[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUSGSYearlyStats() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 10;
      const years = Array.from({ length: 10 }, (_, i) => startYear + i);

      try {
        // Query USGS API for M4.5+ earthquake counts per year
        const results = await Promise.all(
          years.map(async (year) => {
            const res = await fetch(
              `https://earthquake.usgs.gov/fdsnws/event/1/count?starttime=${year}-01-01&endtime=${year}-12-31&minmagnitude=4.5`
            );
            const count = await res.json();
            return { year, count: typeof count === 'number' ? count : 0 };
          })
        );

        if (results.every((item) => item.count > 0)) {
          setData(results);
        }
      } catch (err) {
        console.warn("USGS API fetch failed, falling back to static baseline:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUSGSYearlyStats();
  }, []);

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Global Earthquake Activity (10-Year Trend)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Annual count of global earthquakes ≥ M4.5 sourced from the USGS API
          </p>
        </div>

        {loading && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Syncing USGS telemetry...
          </span>
        )}
      </div>

      
      <div className="h-64 w-full flex items-end gap-1.5 sm:gap-4 pt-8 pb-2 px-1 border-b border-slate-100 dark:border-slate-800 relative">
        {data.map((item, index) => {
          const heightPercent = Math.round((item.count / maxCount) * 100);
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.year}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
            >
      
              {isHovered && (
                <div className="absolute -top-10 z-10 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                  {item.year}: <span className="text-rose-400">{item.count.toLocaleString()}</span> quakes
                </div>
              )}

      
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-sm sm:rounded-t-md transition-all duration-300 ${
                  isHovered
                    ? 'bg-rose-500 shadow-md shadow-rose-500/20'
                    : 'bg-rose-500/80 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500'
                }`}
              />
            </div>
          );
        })}
      </div>

      
      <div className="flex justify-between items-center gap-1.5 sm:gap-4 mt-3 px-1 text-slate-400 text-[10px] sm:text-[11px] font-medium">
        {data.map((item) => (
          <div key={item.year} className="flex-1 text-center tracking-tighter sm:tracking-normal">
      
            <span className="sm:hidden">'{String(item.year).slice(-2)}</span>
            <span className="hidden sm:inline">{item.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
  */