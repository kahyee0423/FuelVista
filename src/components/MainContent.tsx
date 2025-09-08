"use client";

import Chart from "./Chart";
import PredictionChart from "./PredictionChart";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import CurrentPrices from "./CurrentPrices";
import CalculatorTabs from "./CalculatorTabs";
import AlertsTab from "./AlertsTab"; 
import { TabType, CARDS } from "../app/constants";

interface MainContentProps {
  tab: TabType;
  data: { level: any[]; weekly: any[]; forecast?: any[] };
  selected: any[];
  error: string | null;
  loading: boolean;
  loadData: (force?: boolean) => void;
}

export default function MainContent({
  tab,
  data,
  selected,
  error,
  loading,
  loadData,
}: MainContentProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const latestPrices = data.level.at(-1) || {};
  return (
    <main className="flex-1 overflow-auto p-6">
      {error ? (
        <ErrorState error={error} loadData={loadData} />
      ) : loading ? (
        <LoadingState />
      ) : (
        <>
          {/* Alerts Tab */}
          {tab === "alerts" && <AlertsTab latestPrices={latestPrices}/>}

          {/* Default charts & cards */}
          {data.level.length > 0 && tab !== "calculator" && tab !== "alerts" && (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Graph in the center */}
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-7xl">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4 select-none mt-3">
                    {tab === "level"
                      ? "Historical Price Trends"
                      : tab === "weekly"
                      ? "Weekly Price Changes"
                      : "Fuel Price Forecast"}
                  </h2>

                  {tab === "forecast" ? (
                    <PredictionChart
                      actual={data.level || []}
                      forecast={data.forecast || []}
                    />
                  ) : (
                    <Chart
                      data={selected}
                      title={
                        tab === "level"
                          ? "Fuel Prices Over Time"
                          : "Weekly Price Changes"
                      }
                      xLabel="Date"
                      yLabel="Price (RM)"
                      valuePrefix="RM "
                    />
                  )}
                </div>
              </div>

              {/* Price cards */}
              {tab !== "forecast" && (
                <CurrentPrices
                  latest={data.level.at(-1)}
                  formatDate={formatDate}
                  cards={CARDS}
                />
              )}
            </div>
          )}

          {/* Calculator Tab */}
          {tab === "calculator" && (
            <div className="w-full">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 select-none mt-4">
                Fuel Calculators
              </h2>
              <CalculatorTabs fuelData={data.level} />
            </div>
          )}
        </>
      )}
    </main>
  );
}