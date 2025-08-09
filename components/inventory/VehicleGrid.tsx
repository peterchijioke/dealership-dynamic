"use client";

import VehicleCard from "./VehicleCard";
import type { Vehicle } from "@/types/vehicle";

// Method 1: CSS Grid auto-fit (Recommended - Pure CSS solution)
export default function VehicleGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
      }}
    >
      {vehicles.map((v, i) => (
        <VehicleCard key={v.id + i.toString()} vehicle={v} />
      ))}
    </div>
  );
}

// Method 2: Using Tailwind with CSS variables
export function VehicleGridTailwind({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      }}
    >
      {vehicles.map((v, i) => (
        <VehicleCard key={v.id + i.toString()} vehicle={v} />
      ))}
    </div>
  );
}

// Method 3: Custom hook with window resize (if you need more control)
import { useState, useEffect } from "react";

function useResponsiveColumns(minCardWidth = 300) {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const calculateColumns = () => {
      const containerWidth = window.innerWidth;
      const availableWidth = containerWidth - 32; // Account for padding
      const cols = Math.floor(availableWidth / minCardWidth);
      setColumns(Math.max(1, cols));
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    return () => window.removeEventListener("resize", calculateColumns);
  }, [minCardWidth]);

  return columns;
}

export function VehicleGridCustom({ vehicles }: { vehicles: Vehicle[] }) {
  const columns = useResponsiveColumns(300);

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {vehicles.map((v, i) => (
        <VehicleCard key={v.id + i.toString()} vehicle={v} />
      ))}
    </div>
  );
}

// Method 4: Container queries (Modern browsers)
export function VehicleGridContainer({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="@container w-full">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
        }}
      >
        {vehicles.map((v, i) => (
          <VehicleCard key={v.id + i.toString()} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
