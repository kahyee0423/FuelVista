"use client";

import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  LegendItem,
  Chart as ChartType,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { PriceData, FuelKey, fuelOptions } from "../lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PredictionChartCanvasProps {
  actual: PriceData[];
  forecast: PriceData[];
  selectedFuel: FuelKey;
}

export default function PredictionChartCanvas({ actual, forecast, selectedFuel }: PredictionChartCanvasProps) {
  useEffect(() => {
    (async () => {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      ChartJS.register(zoomPlugin);
    })();
  }, []);

  const selectedOption = fuelOptions.find((f) => f.key === selectedFuel)!;

  const chartData = {
    datasets: [
      {
        label: `${selectedOption.label} (Actual)`,
        data: actual.map(d => ({ x: new Date(d.date), y: Number(d[selectedFuel]) })),
        borderColor: selectedOption.color,
        backgroundColor: `${selectedOption.color}33`,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: `${selectedOption.label} (Predicted)`,
        data: forecast.map(d => ({ x: new Date(d.date), y: Number(d[selectedFuel]) })),
        borderColor: "#ee8b09ff",
        backgroundColor: "#f16c0c33",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      title: { display: true, text: `Actual vs Predicted Prices for ${selectedOption.label}`, font: { size: 18 } },
      tooltip: {
        mode: "nearest",
        intersect: false,
        callbacks: { label: (ctx: any) => `${ctx.dataset.label}: RM ${ctx.parsed.y.toFixed(2)}` },
      },
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true },
        onClick: (e: MouseEvent, legendItem: LegendItem, legend: any) => {
          const chart = legend.chart as ChartType;
          const meta = chart.getDatasetMeta(legendItem.datasetIndex!);
          meta.hidden = !meta.hidden;
          chart.update();
        },
      },
      zoom: { pan: { enabled: true, mode: "x" }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" } },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "year" },
        title: { display: true, text: "Date" },
        min: new Date("2017-01-01").getTime(),
      },
      y: { title: { display: true, text: "Price (RM)" } },
    },
    interaction: { mode: "nearest", intersect: false, axis: "x" },
  };

  return <Line data={chartData} options={options} />;
}
