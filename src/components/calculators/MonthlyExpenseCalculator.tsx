"use client";

import { useState, useMemo } from "react";

interface MonthlyExpenseCalculatorProps {
  fuelData: any[];
}

const fuelOptions = [
  { value: "ron95", label: "RON95" },
  { value: "ron97", label: "RON97" },
  { value: "diesel", label: "Diesel (Peninsular)" },
  { value: "diesel_eastmsia", label: "Diesel (East Malaysia)" },
];

export default function MonthlyExpenseCalculator({ fuelData }: MonthlyExpenseCalculatorProps) {
  const [dailyDistance, setDailyDistance] = useState(0);
  const [days, setDays] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [fuelType, setFuelType] = useState<string>("ron95");
  const [customPrice, setCustomPrice] = useState<string>("");

  const latest = fuelData?.at(-1);
  const apiPrice = latest ? latest[fuelType] ?? 0 : 0;
  const price = customPrice !== "" ? Number(customPrice) : apiPrice;

  const { monthlyLiters, monthlyCost, yearlyCost } = useMemo(() => {
    const liters = efficiency > 0 ? (dailyDistance * days) / efficiency : 0;
    const cost = liters * price;
    return {
      monthlyLiters: liters,
      monthlyCost: cost,
      yearlyCost: cost * 12,
    };
  }, [dailyDistance, days, efficiency, price]);

  return (
    <div className="max-w-5xl mx-auto p-3">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">Monthly Fuel Expense</h2>
          <p className="text-xs text-green-100">Estimate your monthly and yearly fuel cost</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Daily Distance (km)</label>
                <input
                  type="number"
                  value={dailyDistance}
                  onChange={(e) => setDailyDistance(+e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Days per Month</label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(+e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Fuel Efficiency (km/L)</label>
                <input
                  type="number"
                  value={efficiency}
                  onChange={(e) => setEfficiency(+e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fuelOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Custom Price (RM/L)</label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder={`Latest: RM ${apiPrice?.toFixed(2)}`}
                className="w-full p-2 border rounded-md text-sm"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <h3 className="text-base font-semibold text-gray-700 border-b pb-2">Results</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <p className="text-gray-500">Fuel Needed</p>
                <p className="font-semibold">{monthlyLiters.toFixed(2)} L</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <p className="text-gray-500">Price/L</p>
                <p className="font-semibold">RM {price.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm text-center text-sm">
              <p className="text-gray-500">Monthly Cost</p>
              <p className="text-xl font-bold text-green-700">RM {monthlyCost.toFixed(2)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm text-center text-sm">
              <p className="text-gray-700 font-medium">Yearly Estimate (~12 months)</p>
              <p className="font-semibold">RM {yearlyCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
