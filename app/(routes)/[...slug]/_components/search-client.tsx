"use client";

import { useState, useMemo } from "react";
import type { VehicleHit } from "@/types/vehicle";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import { useInfiniteAlgoliaHits } from "@/hooks/useInfiniteAlgoliaHits";
import { searchWithMultipleQueries } from "@/lib/algolia";

interface Props {
    initialResults: any; // from server (SearchResponse<VehicleHit>)
    refinements?: Record<string, string[]>; // condition: ["New"], make: ["Audi"]
}

export default function SearchClient({ initialResults, refinements = {} }: Props) {
    // Local refinements (can be toggled in sidebar)
    const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>(
        refinements
    );

    // Infinite hits hook
    const { hits, isLastPage, showMore, loading } = useInfiniteAlgoliaHits({
        initialHits: initialResults.hits as VehicleHit[],
        refinements: selectedFacets,
    });

    // Facets state (keeps sidebar counts up to date)
    const [facets, setFacets] = useState(initialResults.facets);

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
            facetFilters: Object.entries({
                ...selectedFacets,
                [facet]: selectedFacets[facet]?.includes(value)
                    ? selectedFacets[facet].filter((v) => v !== value)
                    : [...(selectedFacets[facet] || []), value],
            }).map(([f, vals]) => vals.map((v) => `${f}:${v}`)),
            facets: [
                "condition",
                "make",
                "model",
                "year",
                "body",
                "fuel_type",
                "ext_color",
                "int_color",
                "drive_train",
                "transmission",
            ],
        });

        setFacets(res.facets);
    };

    const sidebarFacets = useMemo(() => facets ?? {}, [facets]);

    return (
        <div className="mt-28">
            <div className="flex-1 relative flex flex-col lg:flex-row">
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    <SidebarFilters
                        facets={sidebarFacets}
                        currentRefinements={selectedFacets}
                        onToggleFacet={updateFacet}
                    />
                </aside>

                <main className="flex-1 space-y-2 bg-gray-100 p-4">
                    <InfiniteHits
                        serverHits={hits}
                        refinements={selectedFacets}
                        isLastPage={isLastPage}
                        showMore={showMore}
                        loading={loading}
                    />
                </main>
            </div>
        </div>
    );
}
