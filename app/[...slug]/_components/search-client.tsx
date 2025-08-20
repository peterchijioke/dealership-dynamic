"use client";

import React from 'react'

import { Accordion } from '@/components/ui/accordion'
import { searchClient, srpIndex } from "@/configs/config";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Configure } from "react-instantsearch";
import { Hits, SearchBox, Pagination, } from "react-instantsearch";
// import VehicleCard from './vehicle-card2';
import { nextRouter, customStateMapping } from '@/lib/algolia/customRouting';

// lazy load only when visible
import dynamic from "next/dynamic";
const CustomRefinementList = dynamic(() => import("@/components/algolia/custom-refinement-list"), { ssr: false });
const CustomRangeInput = dynamic(() => import("@/components/algolia/custom-range-input"), { ssr: false });
const CustomToggleRefinement = dynamic(() => import("@/components/algolia/custom-toggle-refinement"), { ssr: false });
const RefinementAccordionItem = dynamic(() => import("@/components/algolia/refinement-accordion-item"), { ssr: false });
const VehicleCard = dynamic(() => import("./vehicle-card2"));

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
            />
            <div className="flex-1 relative flex flex-col lg:flex-row overflow-hiddenx">
                <aside className="hidden sticky top-30 h-[calc(100vh-30px)] overflow-y-auto lg:block lg:w-[280px] lg:flex-shrink-0 pt-4">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    <div className="h-full overflow-y-autox pt-3">
                        {/* <FilterSidebar /> */}
                        <CustomToggleRefinement
                            attribute="is_special"
                            label="Show Special"
                            labelPosition="left"
                            className="justify-between px-2 pb-3"
                        />
                        <Accordion>
                            <RefinementAccordionItem attribute="condition" title="Condition">
                                <CustomRefinementList attribute="condition" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="price" title="Price">
                                <CustomRangeInput attribute="price" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="year" title="Year">
                                <CustomRefinementList attribute="year" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="make" title="Make">
                                <CustomRefinementList attribute="make" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="model" title="Model & Trim">
                                <CustomRefinementList attribute="model" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="body" title="Body Style">
                                <CustomRefinementList attribute="body" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="fuel_type" title="Fuel Type">
                                <CustomRefinementList attribute="fuel_type" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="ext_color" title="Exterior Color">
                                <CustomRefinementList attribute="ext_color" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="int_color" title="Interior Color">
                                <CustomRefinementList attribute="int_color" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="drive_train" title="Drive Train">
                                <CustomRefinementList attribute="drive_train" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="transmission" title="Transmission">
                                <CustomRefinementList attribute="transmission" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="engine" title="Engine">
                                <CustomRefinementList attribute="engine" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="doors" title="Doors">
                                <CustomRefinementList attribute="doors" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="key_features" title="Key Features">
                                <CustomRefinementList attribute="key_features" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                            <RefinementAccordionItem attribute="mileage" title="Mileage">
                                <CustomRefinementList attribute="mileage" className="px-2 pb-3" />
                            </RefinementAccordionItem>
                        </Accordion>
                    </div>
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