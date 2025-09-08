"use client";

import { useState, useMemo } from "react";

interface TripCostCalculatorProps {
  fuelData: any[];
}

const fuelOptions = [
  { value: "ron95", label: "RON95" },
  { value: "ron97", label: "RON97" },
  { value: "diesel", label: "Diesel (Peninsular)" },
  { value: "diesel_eastmsia", label: "Diesel (East Malaysia)" },
];

export default function TripCostCalculator({ fuelData }: TripCostCalculatorProps) {
  const [distance, setDistance] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [fuelType, setFuelType] = useState<string>("ron95");
  const [customPrice, setCustomPrice] = useState<string>("");

  const [weeklyTrips, setWeeklyTrips] = useState(0);
  const [monthlyTrips, setMonthlyTrips] = useState(0);
  const [yearlyTrips, setYearlyTrips] = useState(0);

  const latest = fuelData?.at(-1);
  const apiPrice = latest ? latest[fuelType] ?? 0 : 0;
  const price = customPrice !== "" ? Number(customPrice) : apiPrice;

  const {
    litersNeeded,
    totalCost,
    costPerKm,
    roundTripCost,
    weeklyCommuteCost,
    monthlyCommuteCost,
    yearlyCommuteCost,
    savingsVsApi,
    savingsPct,
  } = useMemo(() => {
    const liters = efficiency > 0 ? distance / efficiency : 0;
    const cost = liters * price;
    const apiCost = liters * apiPrice;

    return {
      litersNeeded: liters,
      totalCost: cost,
      costPerKm: distance > 0 ? cost / distance : 0,
      roundTripCost: cost * 2,
      weeklyCommuteCost: cost * weeklyTrips,
      monthlyCommuteCost: cost * monthlyTrips,
      yearlyCommuteCost: cost * yearlyTrips,
      savingsVsApi: customPrice !== "" ? apiCost - cost : 0,
      savingsPct: customPrice !== "" && apiCost > 0 ? ((apiCost - cost) / apiCost) * 100 : 0,
    };
  }, [distance, efficiency, price, customPrice, apiPrice, weeklyTrips, monthlyTrips, yearlyTrips]);

  return (
    <div className="max-w-5xl mx-auto p-3 -mt-7">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">Trip Cost Calculator</h2>
          <p className="text-xs text-blue-100">Estimate fuel usage & costs</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Distance (km)</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(+e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Efficiency (km/L)</label>
                <input
                  type="number"
                  value={efficiency}
                  onChange={(e) => setEfficiency(+e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  min="0.1"
                  step="0.1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fuelOptions.map((fuel) => (
                    <option key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </option>
                  ))}
                </select>
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
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Commute Frequency</h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Weekly</label>
                  <input
                    type="number"
                    value={weeklyTrips}
                    onChange={(e) => setWeeklyTrips(+e.target.value)}
                    className="w-full p-1 border rounded text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Monthly</label>
                  <input
                    type="number"
                    value={monthlyTrips}
                    onChange={(e) => setMonthlyTrips(+e.target.value)}
                    className="w-full p-1 border rounded text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Yearly</label>
                  <input
                    type="number"
                    value={yearlyTrips}
                    onChange={(e) => setYearlyTrips(+e.target.value)}
                    className="w-full p-1 border rounded text-sm"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h3 className="text-base font-semibold text-gray-700 border-b pb-2">Results</h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <p className="text-gray-500">Fuel Needed</p>
                <p className="font-semibold">{litersNeeded.toFixed(2)} L</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <p className="text-gray-500">Price/L</p>
                <p className="font-semibold">RM {price.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm text-center text-sm">
              <p className="text-gray-500">Total Trip Cost</p>
              <p className="text-xl font-bold text-blue-600">RM {totalCost.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <p className="text-gray-500">Per km</p>
                <p className="font-medium">RM {costPerKm.toFixed(2)}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <p className="text-gray-500">Round trip</p>
                <p className="font-medium">RM {roundTripCost.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm text-sm">
              <p className="font-medium text-gray-700 mb-2">Commute Costs</p>
              <div className="flex justify-between"><span>Weekly</span><span>RM {weeklyCommuteCost.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Monthly</span><span>RM {monthlyCommuteCost.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Yearly</span><span>RM {yearlyCommuteCost.toFixed(2)}</span></div>
            </div>
            {customPrice !== "" && (
              <div className={`p-3 rounded text-center text-sm ${savingsVsApi > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {savingsVsApi > 0
                  ? `Save RM ${savingsVsApi.toFixed(2)} (${savingsPct.toFixed(1)}%)`
                  : `Pay RM ${Math.abs(savingsVsApi).toFixed(2)} (${Math.abs(savingsPct).toFixed(1)}%) more`}
                <div className="text-[12px] mt-1">compared to current price</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}