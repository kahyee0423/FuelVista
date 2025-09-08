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

interface Props {
  data: any[];
  title: string;
  xLabel: string;
  yLabel: string;
  valuePrefix?: string;
}

const Chart: React.FC<Props> = ({
  data,
  title,
  xLabel,
  yLabel,
  valuePrefix = "RM ",
}) => {
  useEffect(() => {
    (async () => {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      ChartJS.register(zoomPlugin);
    })();
  }, []);

  const dates = data.map((d) => new Date(d.date));

  const datasetStyle = (label: string, color: string, values: number[]) => ({
    label,
    data: values,
    borderColor: color,
    backgroundColor: `${color}33`,
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.3,
  });

  const chartData = {
    labels: dates,
    datasets: [
      datasetStyle("RON95", "#ff6384", data.map((d) => d.ron95)),
      datasetStyle("RON97", "#36a2eb", data.map((d) => d.ron97)),
      datasetStyle("Diesel (Peninsular)", "#4bc0c0", data.map((d) => d.diesel)),
      datasetStyle(
        "Diesel (East Malaysia)",
        "#7b3fbb",
        data.map((d) => d.diesel_eastmsia)
      ),
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      title: { display: true, text: title, font: { size: 18 } },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${valuePrefix}${context.parsed.y.toFixed(
              2
            )}`,
        },
      },
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true },
        onClick: (e: MouseEvent, legendItem: LegendItem, legend: any) => {
          const chart = legend.chart as ChartType;
          const index = legendItem.datasetIndex!;
          const meta = chart.getDatasetMeta(index);
          const dataset = chart.data.datasets?.[index];
          if (!dataset) return;
          meta.hidden = !meta.hidden; 
          chart.update();
        },
      },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
          limits: { x: { min: new Date("2017-01-01").getTime() } },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "year" },
        title: { display: true, text: xLabel },
        min: new Date("2017-01-01").getTime(),
        ticks: {
          callback: function (val: any, index: number, ticks: any) {
            const date = new Date(ticks[index].value);
            const year = date.getFullYear();
            const yearTicks = ticks.filter(
              (t: any) => new Date(t.value).getFullYear() === year
            );
            if (!yearTicks.length) return "";
            const midTick = yearTicks[Math.floor(yearTicks.length / 2)];
            return ticks[index].value === midTick.value ? year.toString() : "";
          },
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: { title: { display: true, text: yLabel } },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  return (
  <div className="border border-gray-300 rounded-xl shadow-sm p-2 bg-white mt-10">
    <Line data={chartData} options={options} />
  </div>
);

};

export default Chart;