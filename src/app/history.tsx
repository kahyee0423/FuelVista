"use client";

import React, { useEffect, useState } from "react";
import Chart from "../components/Chart";
import { fetchFuelData } from "../lib/fuel";

export default function History() {
  const [fuelData, setFuelData] = useState<any[]>([]);

  useEffect(() => {
    async function getData() {
      const { levelData } = await fetchFuelData();
      const formattedData = levelData.map((item: any) => ({
        date: item.date,
        ron95: item.ron95,
        ron97: item.ron97,
        diesel: item.diesel,
        diesel_eastmsia: item.diesel_eastmsia,
      }));
      setFuelData(formattedData);
    }
    getData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">FuelSight History</h1>
      <Chart
        data={fuelData}
        title="Historical Fuel Prices"
        xLabel="Date"
        yLabel="Price (RM)"
      />
    </div>
  );
}
