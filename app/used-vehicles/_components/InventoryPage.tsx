"use client";

import { useMemo, useEffect } from "react";
import VehicleGrid from "../../../components/inventory/VehicleGrid";
import {
  createInstantSearchNextInstance,
  InstantSearchNext,
} from "react-instantsearch-nextjs";
import { searchClient, srpIndex } from "@/configs/config";
import DynamicRefinements from "../../../components/inventory/DynamicRefinements";
import { SearchInventory } from "../../../components/inventory/search-inventory";
import CarouselBanner from "../../../components/inventory/CarouselBanner";
import { Configure } from "react-instantsearch";

// Create instance outside component to avoid recreation on every render
const searchInstance = createInstantSearchNextInstance();

export default function InventoryPage() {
  return (
    <InstantSearchNext
      instance={searchInstance}
      ignoreMultipleHooksWarning
      insights={true}
      indexName={srpIndex}
      searchClient={searchClient}
      initialUiState={{
        [srpIndex as string]: {
          refinementList: {
            condition: ["used"],
          },
        },
      }}
    >
      <Configure facets={["*"]} facetingAfterDistinct hitsPerPage={20} />

      <div className="h-screen flex flex-col relative pt-24 ">
        <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
          <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0">
            <div className="h-full overflow-y-auto px-2 pt-3">
              <DynamicRefinements />
            </div>
          </aside>

          {/* Right: main content area with its own scroll and proper padding */}
          <main className="flex-1 space-y-2 overflow-y-auto ">
            <CarouselBanner />
            <SearchInventory />
            <VehicleGrid />
            <div className="h-6" />
          </main>
        </div>

        {/* Mobile Drawer */}
      </div>
    </InstantSearchNext>
  );
}
