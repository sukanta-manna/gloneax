/********************************************************************* 
Author: Sukanta Manna   
Purpose: Plot Child Mortality (Mobile Responsive).
**********************************************************************/
import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type Point,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type CountryData = Record<string, Record<string, number>>;

export interface PlotChildMortalityProps {
  country?: string;
  dataUrl?: string;
  prediction: { year: number; value: number };
}

export default function PlotChildMortality({
  country = "AFG",
  dataUrl = "ml/Child_Mortality_Data/childMortality.json",
  prediction,
}: PlotChildMortalityProps) {
  const [data, setData] = useState<CountryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError(null);

    fetch(dataUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${dataUrl}: ${res.status}`);
        return res.json() as Promise<CountryData>;
      })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : String(err));
      });

    return () => controller.abort();
  }, [dataUrl]);

  const chartData = useMemo<ChartData<"line", Point[]> | null>(() => {
    const series = data?.[country];
    if (!series) return null;

    const observed: Point[] = Object.entries(series)
      .map(([year, value]) => ({ x: Number(year), y: value }))
      .sort((a, b) => a.x - b.x);
    const last = observed[observed.length - 1];

    return {
      datasets: [
        {
          label: "Observed",
          data: observed,
          borderColor: "#1f77b4",
          backgroundColor: "#1f77b4",
          borderWidth: 2,
          pointRadius: 1.5,
          tension: 0,
        },
        {
          label: `Predicted (${prediction.year})`,
          data: [last, { x: prediction.year, y: prediction.value }],
          borderColor: "#d62728",
          backgroundColor: "#d62728",
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: [0, 6],
          pointStyle: "rectRot",
          tension: 0,
        },
      ],
    };
  }, [data, country, prediction.year, prediction.value]);

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // Allows chart container height to dictate size on mobile
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        title: {
          display: true,
          text: `Child Mortality, ${country}: Observed vs Predicted`,
          font: { size: 13, weight: "bold" },
          padding: { bottom: 12 },
        },
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            font: { size: 11 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toFixed(1)} per 1,000`,
          },
        },
      },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Year", font: { size: 11 } },
          ticks: {
            callback: (v) => String(v),
            font: { size: 10 },
            maxRotation: 0,
          },
        },
        y: {
          title: {
            display: true,
            text: "Deaths per 1,000 live births",
            font: { size: 10 },
          },
          ticks: { font: { size: 10 } },
          beginAtZero: true,
        },
      },
    }),
    [country]
  );

  if (error) return <p role="alert" className="text-xs text-rose-500">Could not load chart: {error}</p>;
  if (!data) return <p className="text-xs text-slate-500">Loading chart data…</p>;
  if (!chartData) return <p role="alert" className="text-xs text-rose-500">No data for country &quot;{country}&quot;.</p>;

  return (
    /* Height explicitly set to 350px on mobile and 420px on desktop */
    <div className="w-full h-[350px] sm:h-[420px] relative">
      <Line data={chartData} options={options} />
    </div>
  );
}