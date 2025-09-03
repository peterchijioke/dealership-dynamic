"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SearchResponse } from "algoliasearch";
import type { VehicleHit } from "@/types/vehicle";
import SidebarFilters from "./sidebar-filters";
import { searchWithMultipleQueries } from "@/lib/algolia";
import InfiniteHits from "@/components/algolia/infinite-hits-2";

interface Props {
    // initialResults: SearchResponse<VehicleHit[]>;
    initialResults: any;
    facetFilters?: string[][];
}

export default function SearchClient({ initialResults, facetFilters }: Props) {
    const router = useRouter();
    // const pathname = usePathname();

    // Initialize query from the current slug
    // const initialSlug = pathname.split("/").filter(Boolean); // e.g., /brand/nike/shirts → ["brand","nike","shirts"]

    const [results, setResults] = useState<any>(initialResults);
    // const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});
    const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>(() => {
        if (!facetFilters) return {};
        return facetFilters.reduce((acc, group) => {
            group.forEach(f => {
                const [key, val] = f.split(":");
                acc[key] = acc[key] ? [...acc[key], val] : [val];
            });
            return acc;
        }, {} as Record<string, string[]>);
    });
    const [page, setPage] = useState(0);
    const hitsPerPage = 12;
    const loadingRef = useRef(false);
    const didMountRef = useRef(false);

    console.log("initial results: ", initialResults);

    const updateFacet = (facet: string, value: string) => {
        setSelectedFacets(prev => {
            const current = prev[facet] || [];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [facet]: updated };
        });
        setPage(0);
    };

    const fetchResults = useCallback(
        async (currentPage: number, append = false) => {
            if (loadingRef.current) return;
            loadingRef.current = true;

            const facetFilters: (string | string[])[] = Object.entries(selectedFacets)
                .filter(([_, values]) => values.length > 0)
                .map(([facet, values]) =>
                    values.length > 1 ? values.map(v => `${facet}:${v}`) : `${facet}:${values[0]}`
                );

            const results = await searchWithMultipleQueries({
                hitsPerPage,
                page: currentPage,
                facetFilters,
                facets: ["*"],
                attributesToRetrieve: ["*"],
            });

            setResults((prev: any) => ({
                ...results,
                hits: append ? [...prev.hits, ...results.hits] : results.hits,
            }));

            loadingRef.current = false;
        },
        [selectedFacets, hitsPerPage]
    );


    const fetchResultsx = useCallback(
        async (currentPage: number, append = false) => {
            if (loadingRef.current) return;
            loadingRef.current = true;

            // const facetFilters: string[][] = Object.entries(selectedFacets)
            //     .filter(([_, values]) => values.length > 0)
            //     .map(([facet, values]) => values.map(v => `${facet}:${v}`));
            
            const params = new URLSearchParams();
            // if (query) params.append("query", query);
            params.append("hitsPerPage", hitsPerPage.toString());
            params.append("page", currentPage.toString());
            params.append("facets", JSON.stringify(["*"]));
            params.append(
                "attributesToRetrieve",
                JSON.stringify(["*"])
            );
            // params.append("facets", JSON.stringify(FACETS));
            // params.append(
            //     "attributesToRetrieve",
            //     JSON.stringify(ATTRUBUTES_TO_RETRIEVE)
            // );

            // if (facetFilters.length) {
            //     params.append(
            //         "facetFilters",
            //         facetFilters.map(f => f.join(";")).join(",")
            //     );
            // }

            // const res = await fetch(`/api/search?${params.toString()}`);
            // const data: SearchResponse<VehicleHit[]> = await res.json();

            const results = await searchWithMultipleQueries({
                // query: searchQuery,
                hitsPerPage: 12,
                facetFilters,
                facets: ["*"],
                attributesToRetrieve: ["*"],
            });

            alert(JSON.stringify(results));

            setResults((prev: any) => ({
                ...results,
                hits: append ? [...prev.hits, ...results.hits] : results.hits,
            }));

            loadingRef.current = false;
        },
        [selectedFacets, router]
    );

    // Fetch on query/facets/page change
    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return; // skip the first effect run
        }
        fetchResults(page, page > 0);
    }, [selectedFacets, page, fetchResults]);

    // console.log("results useState 2:", results.hits);

    return (
        <div className="mt-28">

            <div className="flex-1 relative flex flex-col lg:flex-row">
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 stickyx top-[120px]x h-[calc(100vh-120px)]x overflow-y-autox">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    {/* Facets */}
                    <SidebarFilters
                        facets={results.facets}
                        currentRefinements={selectedFacets}
                        onToggleFacet={updateFacet}
                    />
                </aside>

                <main className="flex-1 space-y-2 bg-gray-100 p-4">
                    {/* Results */}
                    <InfiniteHits serverHits={results.hits} refinements={selectedFacets} />
                </main>
            </div>


        </div>
    );
}
