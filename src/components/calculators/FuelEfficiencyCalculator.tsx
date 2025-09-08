"use client";

import { useState, useMemo } from "react";

interface FuelTypeComparisonProps {
  fuelData: any[];
}

const fuelOptions = [
  { value: "ron95", label: "RON95" },
  { value: "ron97", label: "RON97" },
  { value: "diesel", label: "Diesel (Peninsular)" },
  { value: "diesel_eastmsia", label: "Diesel (East Malaysia)" },
];

export default function FuelTypeComparison({ fuelData }: FuelTypeComparisonProps) {
  const [distance, setDistance] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [fuelA, setFuelA] = useState("ron95");
  const [fuelB, setFuelB] = useState("ron97");
  const [customPriceA, setCustomPriceA] = useState<string>("");
  const [customPriceB, setCustomPriceB] = useState<string>("");

  const latest = fuelData?.at(-1) || {};
  const apiPriceA = latest[fuelA] || 0;
  const apiPriceB = latest[fuelB] || 0;

  const priceA = customPriceA !== "" ? Number(customPriceA) : apiPriceA;
  const priceB = customPriceB !== "" ? Number(customPriceB) : apiPriceB;

  const {
    litersNeeded,
    costA,
    costB,
    diff,
    costPerKmA,
    costPerKmB,
    percentageDiff,
    monthlyCostA,
    monthlyCostB,
    yearlyCostA,
    yearlyCostB,
  } = useMemo(() => {
    const liters = efficiency > 0 ? distance / efficiency : 0;
    const cA = liters * priceA;
    const cB = liters * priceB;
    const monthlyDistance = 1000;
    const monthlyLiters = monthlyDistance / efficiency;
    return {
      litersNeeded: liters,
      costA: cA,
      costB: cB,
      diff: cB - cA,
      costPerKmA: efficiency > 0 ? priceA / efficiency : 0,
      costPerKmB: efficiency > 0 ? priceB / efficiency : 0,
      percentageDiff: cA > 0 ? ((cB - cA) / cA) * 100 : 0,
      monthlyCostA: monthlyLiters * priceA,
      monthlyCostB: monthlyLiters * priceB,
      yearlyCostA: monthlyLiters * priceA * 12,
      yearlyCostB: monthlyLiters * priceB * 12,
    };
  }, [distance, efficiency, priceA, priceB]);

  return (
    <div className="max-w-5xl mx-auto p-3 -mt-7">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">Fuel Type Comparison</h2>
          <p className="text-xs text-purple-100">Compare costs between two fuels</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Fuel A</label>
                <select
                  value={fuelA}
                  onChange={(e) => setFuelA(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fuelOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={customPriceA}
                  onChange={(e) => setCustomPriceA(e.target.value)}
                  placeholder={`Latest: RM ${apiPriceA.toFixed(2)}`}
                  className="w-full p-2 mt-1 border rounded-md text-sm"
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Fuel B</label>
                <select
                  value={fuelB}
                  onChange={(e) => setFuelB(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fuelOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={customPriceB}
                  onChange={(e) => setCustomPriceB(e.target.value)}
                  placeholder={`Latest: RM ${apiPriceB.toFixed(2)}`}
                  className="w-full p-2 mt-1 border rounded-md text-sm"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg space-y-3">
            <h3 className="text-s font-semibold text-gray-700 border-b pb-1">Results</h3>

            <div className="grid grid-cols-2 gap-2 text-s">
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-gray-500">Fuel Needed</p>
                <p className="font-semibold">{litersNeeded.toFixed(2)} L</p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-gray-500">Price/L Comparison</p>
                <p className="font-semibold">
                  {fuelA.toUpperCase()}: RM {priceA.toFixed(2)}
                </p>
                <p className="font-semibold">
                  {fuelB.toUpperCase()}: RM {priceB.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white p-2 rounded shadow-sm text-s">
              <p>
                <span className="font-medium">{fuelA.toUpperCase()}:</span> RM {costA.toFixed(2)} (
                {costPerKmA.toFixed(2)} RM/km)
              </p>
              <p>
                <span className="font-medium">{fuelB.toUpperCase()}:</span> RM {costB.toFixed(2)} (
                {costPerKmB.toFixed(2)} RM/km)
              </p>
              <p>
                <span className="font-medium">Difference:</span>{" "}
                <span className={diff > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  RM {diff.toFixed(2)} ({percentageDiff.toFixed(1)}%)
                </span>
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="font-bold">Monthly Projection</p>
                <p>{fuelA.toUpperCase()}: RM {monthlyCostA.toFixed(2)}</p>
                <p>{fuelB.toUpperCase()}: RM {monthlyCostB.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold">Yearly Projection</p>
                <p>{fuelA.toUpperCase()}: RM {yearlyCostA.toFixed(2)}</p>
                <p>{fuelB.toUpperCase()}: RM {yearlyCostB.toFixed(2)}</p>
              </div>
            </div>
          </div>

            <div className="mt-2 p-3 rounded-lg bg-yellow-100 text-yellow-900 text-xs">
              {diff > 0 ? (
                <p>
                  🚗 <strong>{fuelA.toUpperCase()}</strong> is more cost-effective than{" "}
                  <strong>{fuelB.toUpperCase()}</strong>. Save <strong>RM {Math.abs(diff).toFixed(2)}</strong> for this trip.
                </p>
              ) : diff < 0 ? (
                <p>
                  🚗 <strong>{fuelB.toUpperCase()}</strong> is more cost-effective than{" "}
                  <strong>{fuelA.toUpperCase()}</strong>. Save <strong>RM {Math.abs(diff).toFixed(2)}</strong> for this trip.
                </p>
              ) : (
                <p>⚖️ Both fuels cost the same for this trip.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}