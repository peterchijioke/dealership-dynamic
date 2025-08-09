"use client";

import { useState } from "react";
import VehicleGrid from "./VehicleGrid";
import type { Vehicle } from "@/types/vehicle";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { searchClient, srpIndex } from "@/configs/config";
import DynamicRefinements from "./DynamicRefinements";
import { SearchInventory } from "./search-inventory";

type Props = { vehicleType: "new" | "used" };

export default function InventoryPage({ vehicleType }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // TODO: replace with Algolia hits

  return (
    <InstantSearchNext
      ignoreMultipleHooksWarning
      indexName={srpIndex}
      searchClient={searchClient}
    >
      <div className="h-screen flex flex-col relative pt-24 ">
        {/* Two-pane layout - takes remaining height */}
        <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
          {/* Left: sidebar with its own scroll */}
          <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0">
            <div className="h-full overflow-y-auto px-2">
              <DynamicRefinements />
            </div>
          </aside>

          {/* Right: main content area with its own scroll and proper padding */}
          <main className="flex-1 overflow-y-auto pt-4 ">
            <SearchInventory />
            <VehicleGrid />
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
              <DynamicRefinements />
            </div>
          </>
        )}
      </div>
    </InstantSearchNext>
  );
}
