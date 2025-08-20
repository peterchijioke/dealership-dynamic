import React from 'react'
import { Accordion } from '@/components/ui/accordion'
import CustomRefinementList from "@/components/algolia/custom-refinement-list"
import CustomRangeInput from "@/components/algolia/custom-range-input"
import CustomToggleRefinement from "@/components/algolia/custom-toggle-refinement"
import RefinementAccordionItem from "@/components/algolia/refinement-accordion-item"

// import dynamic from "next/dynamic";

// const CustomRefinementList = dynamic(() => import("@/components/algolia/custom-refinement-list"), { ssr: false });
// const CustomRangeInput = dynamic(() => import("@/components/algolia/custom-range-input"), { ssr: false });
// const CustomToggleRefinement = dynamic(() => import("@/components/algolia/custom-toggle-refinement"), { ssr: false });
// const RefinementAccordionItem = dynamic(() => import("@/components/algolia/refinement-accordion-item"), { ssr: false });

export default function SidebarFilters() {
    return (
        <div className="h-full overflow-y-autox pt-3">
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
    )
}
