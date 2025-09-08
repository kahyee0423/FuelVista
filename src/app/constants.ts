export type TabType = "level" | "weekly" | "forecast" | "calculator" | "alerts";

export type Tab = {
  key: TabType;
  label: string;
  icon: string;
};

export const TABS: Tab[] = [
  { key: "level", label: "Price", icon: "⛽" },
  { key: "weekly", label: "Weekly Changes", icon: "📈" },
  { key: "forecast", label: "Price Forecast", icon: "🔮" },
  { key: "calculator", label: "Fuel Cost Calculator", icon: "🧮" },
  { key: "alerts", label: "Subscription to Alerts", icon: "🔔" },
];

export const CARDS = [
  { type: "RON95", key: "ron95", icon: "⛽" },
  { type: "RON97", key: "ron97", icon: "🛢️" },
  { type: "Diesel (Peninsular)", key: "diesel", icon: "🚛" },
  { type: "Diesel (East Malaysia)", key: "diesel_eastmsia", icon: "🛳️" },
];
