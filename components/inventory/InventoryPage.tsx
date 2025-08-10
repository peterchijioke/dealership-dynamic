"use client";

import { useMemo } from "react";
import VehicleGrid from "./VehicleGrid";
import {
  createInstantSearchNextInstance,
  InstantSearchNext,
} from "react-instantsearch-nextjs";
import { searchClient, srpIndex } from "@/configs/config";
import DynamicRefinements from "./DynamicRefinements";
import { SearchInventory } from "./search-inventory";
import CarouselBanner from "./CarouselBanner";
import { Configure } from "react-instantsearch";
import { usePathname } from "next/navigation";

type Props = {
  vehicleType: "new" | "used";
};

// Create instance outside component to avoid recreation on every render
const searchInstance = createInstantSearchNextInstance();

export default function InventoryPage({ vehicleType }: Props) {
  const pathname = usePathname();

  // Determine initial refinement based on vehicleType prop or pathname
  const initialUiState = useMemo(() => {
    const condition = pathname.includes("new-vehicle") ? "New" : "Used";
    return {
      [srpIndex as string]: {
        refinementList: {
          condition: [condition],
        },
      },
    };
  }, [pathname]);

  return (
    <InstantSearchNext
      instance={searchInstance}
      ignoreMultipleHooksWarning
      insights={true}
      indexName={srpIndex}
      searchClient={searchClient}
      initialUiState={initialUiState}
    >
      <Configure facets={["*"]} facetingAfterDistinct={true} hitsPerPage={20} />

      <div className="min-h-screen flex flex-col pt-24">
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 lg:border-r lg:border-gray-200">
            <div className="h-full overflow-y-auto px-4 py-6">
              <h2 className="text-lg font-semibold mb-4">
                Filter {vehicleType === "new" ? "New" : "Used"} Vehicles
              </h2>
              <DynamicRefinements />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              <CarouselBanner />
              <SearchInventory />
              <VehicleGrid />
            </div>
          </main>
        </div>

        {/* Mobile Filter Button - could trigger a modal/drawer */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Open filters"
          >
            Filters
          </button>
        </div>
      </div>
    </InstantSearchNext>
  );
}
