"use client";

import React from "react";
import { fuelOptions, FuelKey } from "../lib/types";

interface FuelSelectorProps {
  selectedFuel: FuelKey;
  setSelectedFuel: (fuel: FuelKey) => void;
}

export default function FuelSelector({ selectedFuel, setSelectedFuel }: FuelSelectorProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <label className="font-medium text-gray-700">Select Fuel:</label>
      <select
        value={selectedFuel}
        onChange={(e) => setSelectedFuel(e.target.value as FuelKey)}
        className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
      >
        {fuelOptions.map((fuel) => (
          <option key={fuel.key} value={fuel.key}>{fuel.label}</option>
        ))}
      </select>
    </div>
  );
}
