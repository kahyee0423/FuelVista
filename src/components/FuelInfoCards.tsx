"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FuelInfoCardsProps {
  latestPrice: number;
  highestPrice: number;
  lowestPrice: number;
  weeklyActual: number[];
  weeklyPredicted: number[];
}

export default function FuelInfoCards({
  latestPrice,
  highestPrice,
  lowestPrice,
  weeklyActual,
  weeklyPredicted,
}: FuelInfoCardsProps) {
  const predictionData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Actual",
        data: weeklyActual,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        borderWidth: 0,
      },
      {
        label: "Predicted",
        data: weeklyPredicted,
        backgroundColor: "#f59e0b",
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  const predictionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (context: any) =>
            ` ${context.dataset.label}: RM ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Price (RM)",
          font: { weight: "bold" as const },
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        title: {
          display: true,
          text: "Week",
          font: { weight: "bold" as const },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none -mt-5">
      <h2 className="text-2xl font-bold text-gray-900">Price Highlights</h2>
      {/* Current Price Card */}
      <div className="border border-gray-100 rounded-lg shadow-sm p-3 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-3 bg-green-100 rounded-md">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
          <span className="text-s text-gray-500 font-bold">
            Current Price
          </span>
        </div>
        <span className="text-xl font-bold text-green-600">
          RM {latestPrice.toFixed(2)}
        </span>
      </div>

      {/* Highest Price Card */}
      <div className="border border-gray-100 rounded-lg shadow-sm p-3 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-3 bg-red-100 rounded-md">
            <svg
              className="w-4 h-4 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              ></path>
            </svg>
          </div>
          <span className="text-s text-gray-500 font-bold">
            Highest This Month
          </span>
        </div>
        <span className="text-lg font-bold text-red-500">
          RM {highestPrice.toFixed(2)}
        </span>
      </div>

      {/* Lowest Price Card */}
      <div className="border border-gray-100 rounded-lg shadow-sm p-3 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-3 bg-blue-100 rounded-md">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
          <span className="text-s text-gray-500 font-bold">
            Lowest This Month
          </span>
        </div>
        <span className="text-lg font-bold text-blue-500">
          RM {lowestPrice.toFixed(2)}
        </span>
      </div>

      {/* Weekly Comparison Card */}
      <div className="border border-gray-100 rounded-lg shadow-sm p-3 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-3 bg-purple-100 rounded-md">
            <svg
              className="w-4 h-4 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
          <span className="text-s text-gray-500 font-bold">
            Weekly Comparison
          </span>
        </div>
        <div className="h-40">
          <Bar data={predictionData} options={predictionOptions} />
        </div>
      </div>
    </div>
  );
}