"use client";

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

type Props = { vehicleType: "new" | "used" };
const instance = createInstantSearchNextInstance();
export default function InventoryPage({ vehicleType }: Props) {
  return (
    <InstantSearchNext
      instance={instance}
      ignoreMultipleHooksWarning
      insights={true}
      indexName={srpIndex}
      searchClient={searchClient}
    >
      <Configure facets={["*"]} />
      <Configure
        filters={`condition:${vehicleType === "new" ? "NEW" : "USED"}`}
      />
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
