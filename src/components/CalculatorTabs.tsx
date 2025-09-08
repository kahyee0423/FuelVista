import { useState } from "react";
import { Car, DollarSign, Gauge, BarChart3 } from "lucide-react"; 
import TripCostCalculator from "./calculators/TripCostCalculator";
import MonthlyExpenseCalculator from "./calculators/MonthlyExpenseCalculator";
import FuelEfficiencyCalculator from "./calculators/FuelEfficiencyCalculator";
import BreakEvenCalculator from "./calculators/BreakEvenCalculator";

interface CalculatorTabsProps {
  fuelData: any[];
}

export default function CalculatorTabs({ fuelData }: CalculatorTabsProps) {
  const [active, setActive] = useState("trip");

  const calculators = [
    { id: "trip", label: "Trip Cost", icon: Car, component: <TripCostCalculator fuelData={fuelData} /> },
    { id: "monthly", label: "Monthly Expense", icon: DollarSign, component: <MonthlyExpenseCalculator fuelData={fuelData} /> },
    { id: "efficiency", label: "Fuel Efficiency", icon: Gauge, component: <FuelEfficiencyCalculator fuelData={fuelData}/> },
    { id: "breakeven", label: "Break-even", icon: BarChart3, component: <BreakEvenCalculator fuelData={fuelData} /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex gap-8">
      <div className="flex flex-col gap-5 w-1/5">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <button
              key={calc.id}
              onClick={() => setActive(calc.id)}
              className={`flex flex-col items-center justify-center gap-3 h-28 rounded-2xl border transition-all duration-300 relative overflow-hidden
                ${
                  active === calc.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 scale-[1.03] shadow-xl"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-[1.01]"}`
              }
            >
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white to-transparent pointer-events-none" />
              <Icon size={26} />
              <span className="font-medium text-sm">{calc.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1">
        {calculators.find((c) => c.id === active)?.component}
      </div>
    </div>
  );
}
