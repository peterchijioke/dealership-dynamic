"use client";

import React from 'react'

import { searchClient, srpIndex } from "@/configs/config";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Configure } from "react-instantsearch";
import { Hits } from "react-instantsearch";
import VehicleCard from './vehicle-card2';
import { nextRouter, customStateMapping } from '@/lib/algolia/customRouting';

// lazy load only when visible
import dynamic from "next/dynamic";
const SidebarFilters = dynamic(() => import("./sidebar-filters"), {
    ssr: false,
    loading: () => null,
});

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
            <Configure
                hitsPerPage={20}
                maxValuesPerFacet={100}
                facetingAfterDistinct
            />
            <div className="flex-1 relative flex flex-col lg:flex-row overflow-hiddenx">
                <aside className="hidden sticky top-30 h-[calc(100vh-30px)] overflow-y-auto lg:block lg:w-[280px] lg:flex-shrink-0 pt-4">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    <SidebarFilters />
                </aside>
                <main className="flex-1 space-y-2 bg-gray-100 p-4 mt-28 overflow-y-autox">
                    <Hits
                        hitComponent={VehicleHit}
                        classNames={{
                            list: "grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 gap-3",
                            item: "flex",
                        }}
                    />
                    {/* <Pagination /> */}
                </main>
            </div>
        </InstantSearchNext>
    )
}

function VehicleHit({ hit }: any) {
    // console.log("Hit:", hit);
    return (
        <VehicleCard hit={hit} />
    );
}