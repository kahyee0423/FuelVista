"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchFuelData } from "../lib/fuel";
import { fetchForecastData } from "../lib/mlPrediction";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import { TABS, CARDS, TabType } from "./constants"; 

export default function Home() {
  const [tab, setTab] = useState<TabType>("level");
  const [data, setData] = useState<{ level: any[]; weekly: any[]; forecast: any[] }>({
    level: [],
    weekly: [],
    forecast: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchFuelData(force);
      const forecast = await fetchForecastData();
      setData({ level: fetched.levelData, weekly: fetched.changeData, forecast });
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadData();
      const latest = data.level.at(-1);
      if (
        latest &&
        (Date.now() - new Date(latest.date).getTime()) / (1000 * 60 * 60 * 24) >= 7
      ) {
        await loadData(true);
      }
    };
    init();
  }, [loadData]);

  const selected = tab === "level" ? data.level : tab === "weekly" ? data.weekly : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar tab={tab} setTab={setTab} loadData={loadData} loading={loading} />
        <MainContent
          tab={tab}
          data={data}
          selected={selected}
          error={error}
          loading={loading}
          loadData={loadData}
        />
      </div>
      <footer className="bg-white border-t border-gray-200 text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} FuelVista — Developed by Kah Yee. Data sourced from official government publications.
      </footer>
    </div>
  );
}