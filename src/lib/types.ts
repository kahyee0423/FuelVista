export interface PriceData {
  date: string;
  ron95: number;
  ron97: number;
  diesel: number;
  diesel_eastmsia: number;
}

export const fuelOptions = [
  { key: "ron95", label: "RON95", color: "#ff6384" },
  { key: "ron97", label: "RON97", color: "#36a2eb" },
  { key: "diesel", label: "Diesel (Peninsular)", color: "#4bc0c0" },
  { key: "diesel_eastmsia", label: "Diesel (East Malaysia)", color: "#7b3fbb" },
] as const;

export type FuelKey = typeof fuelOptions[number]["key"];
