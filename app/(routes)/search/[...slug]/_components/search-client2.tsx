"use client";

import {
    Configure,
    Hits,
    InstantSearch,
    InstantSearchSSRProvider,
} from "react-instantsearch";
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";
import singletonRouter from "next/router";
import { searchClient, srpIndex } from "@/configs/config";
import type { Vehicle } from "@/types/vehicle";
import VehicleCard from "./vehicle-card";
import SidebarFilters from "./sidebar-filters";


interface Props {
    serverState: any;
}

export default function SearchClient({ serverState }: Props) {
    return (
        <InstantSearchSSRProvider {...serverState}>
            <InstantSearch
                searchClient={searchClient}
                indexName={srpIndex}
                routing={{
                    router: createInstantSearchRouterNext({
                        singletonRouter,
                        serverUrl: process.env.NEXT_PUBLIC_SITE_URL,
                        routerOptions: {
                            cleanUrlOnDispose: false,
                        },
                    }),
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
            </InstantSearch>
        </InstantSearchSSRProvider>
    );
}

function VehicleHit({ hit }: { hit: Vehicle }) {
    return <VehicleCard hit={hit} />;
}
