import React from "react";

const categories = ["All", "Accommodation", "Membership", "Gear"];

export default function ProductFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full ${
            activeFilter === category
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => onFilterChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
