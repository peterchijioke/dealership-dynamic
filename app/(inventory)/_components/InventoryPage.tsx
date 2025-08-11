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
const searchInstance = createInstantSearchNextInstance();

export default function InventoryPage() {
  const pathname = usePathname();

  const indexName = srpIndex!;

  return (
    <InstantSearchNext
      key={`is-${pathname}`}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      // routing={{
      //   stateMapping: {
      //     stateToRoute: (state) => {
      //       const { refinementList = {}, query, page } = state as any;
      //       return {
      //         query,
      //         page,
      //         refinementList: Object.entries(
      //           refinementList as Record<string, any>
      //         ).map(([key, value]) => ({
      //           key,
      //           value,
      //         })),
      //       };
      //     },
      //     routeToState: (route) => {
      //       const { query, page, refinementList } = route as any;
      //       const refinementArray = Array.isArray(refinementList)
      //         ? refinementList
      //         : [];
      //       return {
      //         query,
      //         page,
      //         refinementList: refinementArray.reduce(
      //           (acc: Record<string, any>, { key, value }) => {
      //             acc[key] = value;
      //             return acc;
      //           },
      //           {}
      //         ),
      //       };
      //     },
      //   },
      // }}
      instance={searchInstance}
      ignoreMultipleHooksWarning
      insights={true}
      indexName={indexName}
      searchClient={searchClient}
    >
      <Configure
        facets={["*"]}
        facetingAfterDistinct
        hitsPerPage={20}
        maxValuesPerFacet={1000}
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
