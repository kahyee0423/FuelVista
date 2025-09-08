"use client";

import PriceCard from "./PriceCard";

interface CurrentPricesProps {
  latest: any;
  formatDate: (d: string) => string;
  cards: { type: string; key: string; icon: string }[];
}

export default function CurrentPrices({ latest, formatDate, cards }: CurrentPricesProps) {
  const nextUpdateDate = new Date(latest.date);
  nextUpdateDate.setDate(nextUpdateDate.getDate() + 7);

  return (
    <div className="flex flex-col gap-4 min-w-[220px] select-none">
      <h2 className="text-2xl font-bold text-gray-900 mt-5">Current Fuel Prices</h2>
      <div className="flex flex-col leading-tight">
        <p className="text-sm text-gray-500 mt-1">
          As of: {formatDate(latest.date)}
        </p>
        <p className="text-sm text-gray-500 mt-1 mb-1">
          Next update: {formatDate(nextUpdateDate.toISOString())}
        </p>
      </div>
      {cards.map((c) => (
        <PriceCard
          key={c.key}
          type={c.type}
          icon={c.icon}
          price={latest[c.key]}
        />
      ))}
    </div>
  );
}