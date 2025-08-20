"use client";

import React from "react";
import { searchClient, srpIndex } from "@/configs/config";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Configure, Hits } from "react-instantsearch";
import { nextRouter, customStateMapping } from "@/lib/algolia/customRouting";
import SidebarFilters from "./sidebar-filters";
import type { Vehicle } from "@/types/vehicle";
import VehicleCard from "./vehicle-card2";

// import dynamic from "next/dynamic";

// const SidebarFilters = dynamic(() => import("./sidebar-filters"), {
//     ssr: false,
//     loading: () => null,
// });

export default function SearchClient() {
    return (
        <InstantSearchNext
            searchClient={searchClient}
            indexName={srpIndex}
            ignoreMultipleHooksWarning
            future={{
                preserveSharedStateOnUnmount: true,
                persistHierarchicalRootCount: true,
            }}
            // routing={routing as unknown as any}
            routing={{
                router: nextRouter as unknown as any,
                stateMapping: customStateMapping,
            }}
        >
            <Configure hitsPerPage={20} maxValuesPerFacet={100} facetingAfterDistinct />

            <div className="flex-1 relative flex flex-col lg:flex-row">
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    <SidebarFilters />
                </aside>

                <main className="flex-1 space-y-2 bg-gray-100 p-4 mt-28">
                    <Hits
                        hitComponent={VehicleHit}
                        classNames={{
                            list: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3",
                            item: "flex",
                        }}
                    />
                </main>
            </div>
        </InstantSearchNext>
    );
}

function VehicleHit({ hit }: { hit: Vehicle }) {
    return <VehicleCard hit={hit} />;
}
