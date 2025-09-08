"use client";

import { useState, useMemo } from "react";

interface BreakEvenCalculatorProps {
  fuelData: any[];
}

const fuelOptions = [
  { value: "ron95", label: "RON95" },
  { value: "ron97", label: "RON97" },
  { value: "diesel", label: "Diesel (Peninsular)" },
  { value: "diesel_eastmsia", label: "Diesel (East Malaysia)" },
];

export default function BreakEvenCalculator({ fuelData }: BreakEvenCalculatorProps) {
  const [distancePerMonth, setDistancePerMonth] = useState(0);
  const [eff1, setEff1] = useState(0);
  const [eff2, setEff2] = useState(0);
  const [fuel1, setFuel1] = useState("ron95");
  const [fuel2, setFuel2] = useState("ron97");
  const [extraCost, setExtraCost] = useState(0);

  const latest = fuelData?.at(-1) || {};
  const price1 = latest[fuel1] || 0;
  const price2 = latest[fuel2] || 0;

  const {
    monthlyCost1,
    monthlyCost2,
    costPerKm1,
    costPerKm2,
    monthlyDiff,
    yearlySavings,
    breakEvenMonths,
    breakEvenYears,
    breakEvenDistance,
  } = useMemo(() => {
    const liters1 = distancePerMonth / eff1;
    const liters2 = distancePerMonth / eff2;
    const monthly1 = liters1 * price1;
    const monthly2 = liters2 * price2;
    const diff = monthly1 - monthly2;
    const months = diff > 0 ? extraCost / diff : Infinity;

    return {
      monthlyCost1: monthly1,
      monthlyCost2: monthly2,
      costPerKm1: eff1 > 0 ? price1 / eff1 : 0,
      costPerKm2: eff2 > 0 ? price2 / eff2 : 0,
      monthlyDiff: diff,
      yearlySavings: diff * 12,
      breakEvenMonths: months,
      breakEvenYears: months / 12,
      breakEvenDistance: distancePerMonth * months,
    };
  }, [distancePerMonth, eff1, eff2, price1, price2, extraCost]);

  return (
    <div className="max-w-5xl mx-auto p-3 -mt-7">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">Fuel Break-even Calculator</h2>
          <p className="text-xs text-yellow-100">Compare two fuels or vehicles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">Monthly Distance (km)</label>
              <input
                type="number"
                value={distancePerMonth}
                onChange={(e) => setDistancePerMonth(+e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                min={0}
              />
            </div>

            {/* Fuel 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Fuel A</label>
                <select
                  value={fuel1}
                  onChange={(e) => setFuel1(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fuelOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Efficiency (km/L)</label>
                <input
                  type="number"
                  value={eff1}
                  onChange={(e) => setEff1(+e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  min={1}
                  step={0.1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Fuel B</label>
                <select
                  value={fuel2}
                  onChange={(e) => setFuel2(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fuelOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Efficiency (km/L)</label>
                <input
                  type="number"
                  value={eff2}
                  onChange={(e) => setEff2(+e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  min={1}
                  step={0.1}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Extra Cost (RM)</label>
              <input
                type="number"
                value={extraCost}
                onChange={(e) => setExtraCost(+e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                min={0}
              />
            </div>
          </div>

          <div className="bg-yellow-50 p-5 rounded-lg space-y-5">
            <h3 className="text-base font-semibold text-gray-700 border-b pb-2">Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded shadow text-center">
                <p className="text-gray-600">Fuel A ({fuel1.toUpperCase()})</p>
                <p className="font-semibold text-lg mt-1">RM {monthlyCost1.toFixed(2)}/month</p>
                <p className="text-gray-500 text-sm mt-1">{costPerKm1.toFixed(2)} RM/km</p>
              </div>
              <div className="bg-white p-3 rounded shadow text-center">
                <p className="text-gray-600">Fuel B ({fuel2.toUpperCase()})</p>
                <p className="font-semibold text-lg mt-1">RM {monthlyCost2.toFixed(2)}/month</p>
                <p className="text-gray-500 text-sm mt-1">{costPerKm2.toFixed(2)} RM/km</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded shadow text-center text-sm">
              <p>
                Monthly Difference:{" "}
                <span
                  className={monthlyDiff > 0 ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}
                >
                  RM {monthlyDiff.toFixed(2)}
                </span>
              </p>
              <p className="mt-1">Yearly Savings: RM {Math.abs(yearlySavings).toFixed(2)}</p>
            </div>

            <div className="bg-white p-3 rounded shadow text-center text-sm">
              <p className="font-bold">Break-even Point</p>
              <p className="mt-1">
                {breakEvenMonths === Infinity
                  ? "Never"
                  : `${breakEvenMonths.toFixed(1)} months (~${breakEvenYears.toFixed(
                      1
                    )} years, ${breakEvenDistance.toFixed(0)} km)`}
              </p>
            </div>

            <div
              className={`p-3 rounded text-center text-sm ${
                breakEvenMonths === Infinity
                  ? "bg-red-50 text-red-700"
                  : breakEvenYears > 10
                  ? "bg-yellow-100 text-yellow-900"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {breakEvenMonths === Infinity ? (
                <p>The more efficient option never pays off against the extra cost.</p>
              ) : breakEvenYears > 10 ? (
                <p>Break-even takes over 10 years. Consider your driving habits carefully.</p>
              ) : (
                <p>Break-even is achievable in about {breakEvenYears.toFixed(1)} years.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}