"use client";

import React from "react";
import { searchClient, srpIndex } from "@/configs/config";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Configure, Hits } from "react-instantsearch";
import { nextRouter, customStateMapping } from "@/lib/algolia/customRouting";

import dynamic from "next/dynamic";
import type { Vehicle } from "@/types/vehicle";

// Lazy load filters & cards
const SidebarFilters = dynamic(() => import("./sidebar-filters"), {
    ssr: false,
    loading: () => null,
});
const VehicleCard = dynamic(() => import("./vehicle-card2"), {
    ssr: false,
    loading: () => (
        <div className="h-40 bg-gray-200 animate-pulse rounded-xl" />
    ),
});

// function LazySidebar() {
//     const [show, setShow] = React.useState(false);
//     const ref = React.useRef<HTMLDivElement>(null);

//     React.useEffect(() => {
//         if (!ref.current) return;
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 if (entries[0].isIntersecting) {
//                     setShow(true);
//                     observer.disconnect();
//                 }
//             },
//             { rootMargin: "200px" } // load earlier
//         );
//         observer.observe(ref.current);
//         return () => observer.disconnect();
//     }, []);

//     return <div ref={ref}>{show ? <SidebarFilters /> : null}</div>;
// }

export default function SearchClient() {
    return (
        <InstantSearchNext
            searchClient={searchClient}
            indexName={srpIndex}
            ignoreMultipleHooksWarning
            routing={{
                router: nextRouter as unknown as any,
                stateMapping: customStateMapping,
            }}
        >
            <Configure hitsPerPage={20} maxValuesPerFacet={100} facetingAfterDistinct />

            <div className="flex-1 relative flex flex-col lg:flex-row">
                {/* Sidebar only visible on desktop */}
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    <SidebarFilters />
                </aside>

                {/* Hits list */}
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
