"use client";

import { useState, useMemo } from "react";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import { generateFacetFilters, searchWithMultipleQueries, updateFacetFilter } from "@/lib/algolia";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActiveFiltersBar from "./active-filters";
import { useAlgolia, useAllRefinements } from "@/hooks/useAlgolia";
import { algoliaSortOptions, CATEGORICAL_FACETS } from "@/configs/config";
import SortDropdown from "./sort-opptions";

interface Props {
    initialResults: any;
    refinements?: Record<string, string[]>; // condition: ["New"], make: ["Audi"]
}

export default function SearchClient({
    initialResults,
    refinements = {},
}: Props) {
    const [selectedFacets, setSelectedFacets] =
        useState<Record<string, string[]>>(refinements);
    const [facets, setFacets] = useState(initialResults.facets);
    const [sortIndex, setSortIndex] = useState(algoliaSortOptions[0].value);
    const { refinements: filterRefinements } = useAllRefinements();
    const { stateToRoute } = useAlgolia();

    const handleRemoveFilter = (facet: string, value: string) => {
        if (!facet || !value) return;
        const updated = updateFacetFilter(selectedFacets, facet, value);
        // console.log("Remove filter", updated);
        stateToRoute(updated);
        updateFacet(facet, value);
        // setSelectedFacets((prev) => {
        //     const updated = (prev[facet] || []).filter((v) => v !== value);
        //     const next = { ...prev, [facet]: updated };
        //     if (updated.length === 0) delete next[facet];
        //     return next;
        // });
    };

    const handleClearAll = () => {
        const defaultRefinements = { condition: ["New"] };
        setSelectedFacets(defaultRefinements);
        stateToRoute(defaultRefinements);
    };

    const buildFacetFilters = (facet: string, value: string) => {
        return Object.entries({
            ...selectedFacets,
            [facet]: selectedFacets[facet]?.includes(value)
                ? selectedFacets[facet].filter((v) => v !== value)
                : [...(selectedFacets[facet] || []), value],
        }).map(([f, vals]) => vals.map((v) => `${f}:${v}`));
    };

    // When user toggles a facet in Sidebar
    const updateFacet = async (facet: string, value: string) => {
        setSelectedFacets((prev) => {
            const current = prev[facet] || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [facet]: updated };
        });

        // Refetch facets so sidebar counts stay in sync
        const res = await searchWithMultipleQueries({
            hitsPerPage: 0, // no hits, only facets
            facetFilters: buildFacetFilters(facet, value),
            sortIndex: sortIndex,
            facets: CATEGORICAL_FACETS,
        });

        setFacets(res.facets);
    };

    const handleSortChange = async (newSort: string) => {
        setSortIndex(newSort);
        const res = await searchWithMultipleQueries({
            hitsPerPage: 0, // no hits, only facets
            facetFilters: generateFacetFilters(selectedFacets),
            sortIndex: newSort,
            facets: CATEGORICAL_FACETS,
        });
        setFacets(res.facets);
    };

    const sidebarFacets = useMemo(() => facets ?? {}, [facets]);

    return (
        <div className="sm:pt-28 md:pt-28 lg:pt-28">
            <div className="h-[calc(100vh-7rem)] flex overflow-hidden">
                {/* SIDEBAR with ScrollArea */}
                <aside className="hidden lg:block w-72 shrink-0 border-r bg-white">
                    <ScrollArea className="h-full">
                        <div className="p-4">
                            <h2 className="font-bold text-center uppercase">
                                Search Filters
                            </h2>
                        </div>
                        <SidebarFilters
                            facets={sidebarFacets}
                            currentRefinements={selectedFacets}
                            onToggleFacet={updateFacet}
                        />
                    </ScrollArea>
                </aside>

                {/* MAIN with ScrollArea */}
                <main className="flex-1 bg-gray-100">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-4">
                            <div className="w-full flex justify-between md:flex-row gap-2">
                                <ActiveFiltersBar
                                    refinements={filterRefinements}
                                    onRemove={handleRemoveFilter}
                                    onClearAll={handleClearAll}
                                />
                                <SortDropdown
                                    currentSort={sortIndex}
                                    onChange={handleSortChange}
                                />
                                {/* <Button className="bg-rose-700 hover:bg-rose-800 p-3 rounded-lg cursor-pointer shrink-0">
                                    <Filter className="size-4 text-white" />
                                </Button> */}
                            </div>

                            <InfiniteHits
                                serverHits={initialResults?.hits ?? []}
                                refinements={selectedFacets}
                            />
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
