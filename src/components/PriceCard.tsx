"use client";

interface PriceCardProps {
  type: string;
  price: number | null;
  icon?: string;
}

const PriceCard = ({ type, price, icon = "⛽" }: PriceCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-900">{type}</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {price ? `RM ${price.toFixed(2)}` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;