"use client";

import { useState } from "react";
import FiltersSidebar from "./FiltersSidebar";
import VehicleGrid from "./VehicleGrid";
import type { Vehicle } from "@/types/vehicle";

type Props = { vehicleType: "new" | "used" };

export default function InventoryPage({ vehicleType }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // TODO: replace with Algolia hits
  const MOCK: Vehicle[] =
    vehicleType === "new"
      ? [
          {
            id: "new1",
            year: 2024,
            make: "Nissan",
            model: "Versa",
            trim: "1.6 S",
            condition: "Certified",
            miles: "4.9k miles",
            retailPrice: 21240,
            discount: 2881,
            salePrice: 18359,
            image:
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200",
            badges: ["CERTIFIED", "VIN #NEW1"],
          },

          {
            id: "new1",
            year: 2024,
            make: "Nissan",
            model: "Versa",
            trim: "1.6 S",
            condition: "Certified",
            miles: "4.9k miles",
            retailPrice: 21240,
            discount: 2881,
            salePrice: 18359,
            image:
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200",
            badges: ["CERTIFIED", "VIN #NEW1"],
          },

          {
            id: "new1",
            year: 2024,
            make: "Nissan",
            model: "Versa",
            trim: "1.6 S",
            condition: "Certified",
            miles: "4.9k miles",
            retailPrice: 21240,
            discount: 2881,
            salePrice: 18359,
            image:
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200",
            badges: ["CERTIFIED", "VIN #NEW1"],
          },

          {
            id: "new1",
            year: 2024,
            make: "Nissan",
            model: "Versa",
            trim: "1.6 S",
            condition: "Certified",
            miles: "4.9k miles",
            retailPrice: 21240,
            discount: 2881,
            salePrice: 18359,
            image:
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200",
            badges: ["CERTIFIED", "VIN #NEW1"],
          },

          {
            id: "new1",
            year: 2024,
            make: "Nissan",
            model: "Versa",
            trim: "1.6 S",
            condition: "Certified",
            miles: "4.9k miles",
            retailPrice: 21240,
            discount: 2881,
            salePrice: 18359,
            image:
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200",
            badges: ["CERTIFIED", "VIN #NEW1"],
          },

          {
            id: "new1",
            year: 2024,
            make: "Nissan",
            model: "Versa",
            trim: "1.6 S",
            condition: "Certified",
            miles: "4.9k miles",
            retailPrice: 21240,
            discount: 2881,
            salePrice: 18359,
            image:
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200",
            badges: ["CERTIFIED", "VIN #NEW1"],
          },

          {
            id: "new1",
            year: 2024,
            make: "Nissan",
            model: "Versa",
            trim: "1.6 S",
            condition: "Certified",
            miles: "4.9k miles",
            retailPrice: 21240,
            discount: 2881,
            salePrice: 18359,
            image:
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200",
            badges: ["CERTIFIED", "VIN #NEW1"],
          },

          // add more mocks as needed
        ]
      : [
          {
            id: "used1",
            year: 2021,
            make: "Toyota",
            model: "Camry",
            trim: "SE",
            condition: "Used",
            miles: "22k miles",
            retailPrice: 22995,
            discount: 1500,
            salePrice: 21495,
            image:
              "https://images.unsplash.com/photo-1617352029421-e7daaf844b4c?q=80&w=1200",
            badges: ["VIN #USED1"],
          },
        ];

  return (
    <div className="h-screen flex flex-col ">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3 lg:mb-6 flex-shrink-0">
        <h1 className="text-xl font-bold capitalize lg:text-2xl">
          {vehicleType} Vehicles
        </h1>
        <button
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-neutral-50 lg:hidden"
        >
          Filters
        </button>
      </div>

      {/* Two-pane layout - takes remaining height */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: sidebar with its own scroll */}
        <aside className="hidden lg:block lg:w-[300px] lg:flex-shrink-0">
          <div className="h-full overflow-y-auto">
            <FiltersSidebar />
          </div>
        </aside>

        {/* Right: main content area with its own scroll and proper padding */}
        <main className="flex-1 overflow-y-auto px-2 ">
          <VehicleGrid vehicles={MOCK} />
          <div className="h-6" />
        </main>
      </div>

      {/* Mobile Drawer */}
      {filtersOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-[380px] overflow-y-auto rounded-r-2xl bg-white p-4 shadow-xl lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Filters
              </div>
              <button
                onClick={() => setFiltersOpen(false)}
                className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100"
              >
                Close
              </button>
            </div>
            <FiltersSidebar />
          </div>
        </>
      )}
    </div>
  );
}
