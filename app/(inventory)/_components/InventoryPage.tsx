"use client";

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
import { usePathname } from "next/navigation";

export default function InventoryPage() {
  const pathname = usePathname();
  if (!srpIndex) {
    return (
      <div className="pt-24 px-4 text-sm text-red-600">
        Missing NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON environment variable.
      </div>
    );
  }

  const indexName = srpIndex as string;
  const searchInstance = createInstantSearchNextInstance();

  return (
    <InstantSearchNext
      key={`is-${pathname}`}
      instance={searchInstance}
      ignoreMultipleHooksWarning
      insights={true}
      indexName={indexName}
      searchClient={searchClient}
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
