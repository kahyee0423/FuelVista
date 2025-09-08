"use client";

import { useState } from "react";
import Chart from "./Chart";

interface ForecastContentProps {
  forecast: any[];
  latest: any;
}

export default function ForecastContent({ forecast, latest }: ForecastContentProps) {
  const [fuelType] = useState("ron95");

  const currentPrice = latest?.[fuelType] ?? 0;
  const prices = forecast.map((f) => f[fuelType]);
  const highestPrice = Math.max(...prices);
  const lowestPrice = Math.min(...prices);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Forecast chart */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 select-none mt-3">
            Predicted Fuel Prices
          </h2>
          <Chart
            data={forecast}
            title="Predicted Fuel Prices"
            xLabel="Date"
            yLabel="Price (RM)"
            valuePrefix="RM "
          />
        </div>
      </div>

      {/* Right-side cards */}
      <div className="flex flex-col gap-4 w-64">
        <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-2xl font-bold">RM {currentPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Highest Price This Forecast</p>
          <p className="text-2xl font-bold">RM {highestPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Lowest Price This Forecast</p>
          <p className="text-2xl font-bold">RM {lowestPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
