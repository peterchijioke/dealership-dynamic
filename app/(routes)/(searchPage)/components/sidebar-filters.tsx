import React from 'react'
import { Accordion } from '@/components/ui/custom-accordion'
import CustomRefinementList from "@/components/algolia/custom-refinement-list"
import CustomRangeInput from "@/components/algolia/custom-range-input"
import CustomToggleRefinement from "@/components/algolia/custom-toggle-refinement"
import RefinementAccordionItem from "@/components/algolia/refinement-accordion-item"

type Props = {
    serverFacets: Record<string, Record<string, number>>;
}

export default function SidebarFilters({ serverFacets }: Props) {
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
                    <CustomRefinementList attribute="condition" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="price" title="Price">
                    <CustomRangeInput attribute="price" className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="year" title="Year">
                    <CustomRefinementList attribute="year" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="make" title="Make">
                    <CustomRefinementList attribute="make" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="model" title="Model & Trim">
                    <CustomRefinementList attribute="model" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="body" title="Body Style">
                    <CustomRefinementList attribute="body" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="fuel_type" title="Fuel Type">
                    <CustomRefinementList attribute="fuel_type" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="ext_color" title="Exterior Color">
                    <CustomRefinementList attribute="ext_color" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="int_color" title="Interior Color">
                    <CustomRefinementList attribute="int_color" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="drive_train" title="Drive Train">
                    <CustomRefinementList attribute="drive_train" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="transmission" title="Transmission">
                    <CustomRefinementList attribute="transmission" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="engine" title="Engine">
                    <CustomRefinementList attribute="engine" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="doors" title="Doors">
                    <CustomRefinementList attribute="doors" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="key_features" title="Key Features">
                    <CustomRefinementList attribute="key_features" serverFacets={serverFacets} skipSuspense={true} className="px-2 pb-3" />
                </RefinementAccordionItem>
                <RefinementAccordionItem attribute="mileage" title="Mileage">
                    <CustomRefinementList attribute="mileage" serverFacets={serverFacets} className="px-2 pb-3" />
                </RefinementAccordionItem>
            </Accordion>
        </div>
    )
}
