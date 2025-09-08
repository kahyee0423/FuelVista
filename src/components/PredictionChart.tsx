"use client";

import React, { useState } from "react";
import { PriceData, FuelKey } from "../lib/types";
import FuelSelector from "./FuelSelector";
import PredictionChartCanvas from "./PredictionChartCanvas";
import FuelInfoCards from "./FuelInfoCards";

interface PredictionChartProps {
  actual: PriceData[];
  forecast: PriceData[];
}

export default function PredictionChart({ actual, forecast }: PredictionChartProps) {
  const [selectedFuel, setSelectedFuel] = useState<FuelKey>("ron95");

  // Current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthData = actual.filter(d => {
    const date = new Date(d.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const latestPrice = Number(actual.at(-1)?.[selectedFuel]);
  const highestPrice = thisMonthData.length
    ? Math.max(...thisMonthData.map(d => Number(d[selectedFuel])))
    : 0;
  const lowestPrice = thisMonthData.length
    ? Math.min(...thisMonthData.map(d => Number(d[selectedFuel])))
    : 0;

  // Compute weekly averages
const weeks: number[][] = [[], [], [], []];
thisMonthData.forEach(d => {
  const date = new Date(d.date);
  const weekIndex = Math.min(Math.floor((date.getDate() - 1) / 7), 3); // 0-based
  weeks[weekIndex].push(Number(d[selectedFuel]));
});
const weeklyActual = weeks.map(w => (w.length ? w.reduce((a, b) => a + b, 0) / w.length : 0));

// For predicted data, just take the next 4 weeks from forecast
const weeklyPredicted = forecast
  .slice(0, 4) // Take next 4 weeks
  .map(pred => Number(pred[selectedFuel])); // Get the predicted value for selected fuel

console.log("WeeklyActual", weeklyActual);
console.log("WeeklyPredicted", weeklyPredicted);

// Debugging only: expose globally
if (typeof window !== "undefined") {
  (window as any).weeklyActual = weeklyActual;
  (window as any).weeklyPredicted = weeklyPredicted;
}

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start mt-6 max-w-7xl mx-auto">
      <div className="flex-1 border border-gray-300 rounded-xl shadow-sm p-4 bg-white">
        <FuelSelector selectedFuel={selectedFuel} setSelectedFuel={setSelectedFuel} />
        <PredictionChartCanvas actual={actual} forecast={forecast} selectedFuel={selectedFuel} />
      </div>
      
      <div className="w-full lg:w-72 flex-shrink-0 -mt-10">
        <FuelInfoCards
          latestPrice={latestPrice}
          highestPrice={highestPrice}
          lowestPrice={lowestPrice}
          weeklyActual={weeklyActual}
          weeklyPredicted={weeklyPredicted}
        />
      </div>
    </div>
  );
}