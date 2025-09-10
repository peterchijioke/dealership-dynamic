import React, { useState } from 'react'
import { Accordion, AccordionItem } from '@/components/ui/custom-accordion'
import CustomRefinementList from "@/components/algolia/filters/custom-refinement-list"
import CustomToggleRefinement from "@/components/algolia/filters/custom-toggle-refinement"

type Props = {
    facets: { [key: string]: { [key: string]: number; } } | undefined;  // { facetName: { value: count } }
    currentRefinements: Record<string, string[]>;   // { facetName: [values...] }
    onToggleFacet: (attribute: string, value: string) => void;
};

export default function SidebarFilters({ facets, currentRefinements, onToggleFacet }: Props) {
    const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>(currentRefinements || {});

    const updateFacet = (attribute: string, value: string) => {
        setSelectedFacets((prev) => {
            const currentValues = prev[attribute] || [];
            const exists = currentValues.includes(value);

            return {
                ...prev,
                [attribute]: exists
                    ? currentValues.filter((v) => v !== value) // remove if exists
                    : [...currentValues, value], // add if not
            };
        });
        onToggleFacet(attribute, value);
    };

    return (
        <div className="h-full overflow-y-autox pt-3">
            <CustomToggleRefinement
                attribute="is_special"
                label="Show Special"
                labelPosition="left"
                selectedFacets={selectedFacets}
                updateFacet={updateFacet}
                className="justify-between px-2 pb-3"
            />
            <Accordion>
                <AccordionItem
                    title="Condition"
                    count={currentRefinements?.condition?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="condition"
                        values={facets?.condition || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                {/* <AccordionItem count={0} title="Price">
                    <CustomRangeInput attribute="price" className="px-2 pb-3" />
                </AccordionItem> */}
                <AccordionItem
                    title="Year"
                    count={currentRefinements?.year?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="year"
                        values={facets?.year || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Make"
                    count={currentRefinements?.make?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="make"
                        values={facets?.make || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Model & Trim"
                    count={currentRefinements?.model?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="model"
                        values={facets?.model || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Body Style"
                    count={currentRefinements?.body?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="body"
                        values={facets?.body || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Fuel Type"
                    count={currentRefinements?.fuel_type?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="fuel_type"
                        values={facets?.fuel_type || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Exterior Color"
                    count={currentRefinements?.ext_color?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="ext_color"
                        values={facets?.ext_color || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Interior Color"
                    count={currentRefinements?.int_color?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="int_color"
                        values={facets?.int_color || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Drive Train"
                    count={currentRefinements?.drive_train?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="drive_train"
                        values={facets?.drive_train || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Transmission"
                    count={currentRefinements?.transmission?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="transmission"
                        values={facets?.transmission || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Engine"
                    count={currentRefinements?.engine?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="engine"
                        values={facets?.engine || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Doors"
                    count={currentRefinements?.doors?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="doors"
                        values={facets?.doors || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Key Features"
                    count={currentRefinements?.key_features?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="key_features"
                        values={facets?.key_features || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
                <AccordionItem
                    title="Mileage"
                    count={currentRefinements?.mileage?.length ?? 0}
                >
                    <CustomRefinementList
                        attribute="mileage"
                        values={facets?.mileage || {}}
                        selectedFacets={selectedFacets}
                        updateFacet={updateFacet}
                        searchable
                        className="px-2 pb-3"
                    />
                </AccordionItem>
            </Accordion>
        </div>
    )
}
