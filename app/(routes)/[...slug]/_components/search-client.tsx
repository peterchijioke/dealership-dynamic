"use client";

import { useState, useMemo } from "react";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import { generateFacetFilters, searchWithMultipleQueries } from "@/lib/algolia";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActiveFiltersBar from "./active-filters";
import { useAlgolia, useAllRefinements } from "@/hooks/useAlgolia";
import { algoliaSortOptions, CATEGORICAL_FACETS } from "@/configs/config";
import SortDropdown from "./sort-opptions";
import { useInfiniteAlgoliaHits } from "@/hooks/useInfiniteAlgoliaHits";

interface Props {
    initialResults: any;
    refinements?: Record<string, string[]>; // condition: ["New"], make: ["Audi"]
}

const HITS_PER_PAGE = 12;

export default function SearchClient({ initialResults, refinements = {} }: Props) {
    const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>(refinements);
    const [facets, setFacets] = useState(initialResults.facets);
    const [sortIndex, setSortIndex] = useState(algoliaSortOptions[0].value);

    const { refinements: filterRefinements } = useAllRefinements();
    const { stateToRoute } = useAlgolia();

    const { hits, showMore, isLastPage, loading } = useInfiniteAlgoliaHits({
        initialHits: initialResults.hits,
        refinements: selectedFacets,
        sortIndex,
        hitsPerPage: HITS_PER_PAGE,
    });

    const buildFacetFilters = (facet?: string, value?: string) => {
        const updated = facet
            ? {
                ...selectedFacets,
                [facet]: selectedFacets[facet]?.includes(value!)
                    ? selectedFacets[facet].filter((v) => v !== value)
                    : [...(selectedFacets[facet] || []), value!],
            }
            : selectedFacets;

        return Object.entries(updated)
            .filter(([_, vals]) => vals.length > 0)
            .map(([f, vals]) => vals.map((v) => `${f}:${v}`));
    };

    const updateFacet = async (facet: string, value: string) => {
        setSelectedFacets((prev) => {
            const current = prev[facet] || [];
            const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
            return { ...prev, [facet]: updated };
        });

        // Refetch facets for sidebar counts
        const res = await searchWithMultipleQueries({
            hitsPerPage: HITS_PER_PAGE,
            facetFilters: buildFacetFilters(facet, value),
            sortIndex,
            facets: CATEGORICAL_FACETS,
        });

        setFacets(res.facets);
    };

    const handleRemoveFilter = async (facet: string, value: string) => {
        setSelectedFacets((prev) => {
            const updated = {
                ...prev,
                [facet]: (prev[facet] || []).filter((v) => v !== value),
            };
            if (updated[facet].length === 0) delete updated[facet];

            stateToRoute(updated);
            return updated;
        });

        const res = await searchWithMultipleQueries({
            hitsPerPage: HITS_PER_PAGE,
            facetFilters: buildFacetFilters(facet, value),
            sortIndex,
            facets: CATEGORICAL_FACETS,
        });

        setFacets(res.facets);
    };

    const handleReset = async () => {
        const defaultRefinements = { condition: ["New"] };
        setSelectedFacets(defaultRefinements);
        stateToRoute(defaultRefinements);

        const res = await searchWithMultipleQueries({
            hitsPerPage: HITS_PER_PAGE,
            facetFilters: buildFacetFilters(),
            sortIndex,
            facets: CATEGORICAL_FACETS,
        });

        setFacets(res.facets);
    };

    const handleSortChange = async (newSort: string) => {
        setSortIndex(newSort);

        const res = await searchWithMultipleQueries({
            hitsPerPage: HITS_PER_PAGE,
            facetFilters: buildFacetFilters(),
            sortIndex: newSort,
            facets: CATEGORICAL_FACETS,
        });

        setFacets(res.facets);
    };

    const sidebarFacets = useMemo(() => facets ?? {}, [facets]);

    return (
        <div className="sm:pt-28 md:pt-28 lg:pt-28">
            <div className="h-[calc(100vh-7rem)] flex overflow-hidden">
                <aside className="hidden lg:block w-72 shrink-0 border-r bg-white">
                    <ScrollArea className="h-full">
                        <div className="p-4">
                            <h2 className="font-bold text-center uppercase">Search Filters</h2>
                        </div>
                        <SidebarFilters
                            facets={sidebarFacets}
                            currentRefinements={selectedFacets}
                            onToggleFacet={updateFacet}
                        />
                    </ScrollArea>
                </aside>

                <main className="flex-1 bg-gray-100">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-4">
                            <div className="w-full flex justify-between md:flex-row gap-2">
                                <ActiveFiltersBar
                                    refinements={filterRefinements}
                                    onRemove={handleRemoveFilter}
                                    onClearAll={handleReset}
                                />
                                <SortDropdown currentSort={sortIndex} onChange={handleSortChange} />
                            </div>

                            <InfiniteHits
                                hits={hits}
                                refinements={selectedFacets}
                                showMore={showMore}
                                isLastPage={isLastPage}
                                loading={loading}
                            />
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
