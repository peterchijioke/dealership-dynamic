"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SearchResponse } from "algoliasearch";
import type { VehicleHit } from "@/types/vehicle";
import VehicleCard from "./vehicle-card";
import SidebarFilters from "./sidebar-filters";

interface Props {
    initialResults: SearchResponse<VehicleHit[]>;
}

export default function SearchClient({ initialResults }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    // Initialize query from the current slug
    const initialSlug = pathname.split("/").filter(Boolean); // e.g., /brand/nike/shirts → ["brand","nike","shirts"]
    const initialQuery = initialSlug.join(" ");

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResponse<VehicleHit[]>>(initialResults);
    const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});
    const [page, setPage] = useState(0);
    const hitsPerPage = 10;
    const loadingRef = useRef(false);

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

            const facetFilters: string[][] = Object.entries(selectedFacets)
                .filter(([_, values]) => values.length > 0)
                .map(([facet, values]) => values.map(v => `${facet}:${v}`));

            const params = new URLSearchParams();
            if (query) params.append("query", query);
            params.append("hitsPerPage", hitsPerPage.toString());
            params.append("page", currentPage.toString());
            if (facetFilters.length) {
                params.append(
                    "facetFilters",
                    facetFilters.map(f => f.join(";")).join(",")
                );
            }

            const res = await fetch(`/api/search?${params.toString()}`);
            const data: SearchResponse<VehicleHit[]> = await res.json();

            setResults(prev => ({
                ...data,
                hits: append ? [...prev.hits, ...data.hits] : data.hits,
            }));

            loadingRef.current = false;

            // Update URL dynamically without refreshing
            const newPath = query
                ? "/" + query.split(" ").join("/")
                : "/";
            router.replace(newPath);
        },
        [query, selectedFacets, router]
    );

    // Fetch on query/facets/page change
    useEffect(() => {
        fetchResults(page, page > 0);
    }, [query, selectedFacets, page, fetchResults]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300 &&
                !loadingRef.current &&
                page < (results.nbPages ?? Math.ceil((results.nbHits as number) / hitsPerPage)) - 1
            ) {
                const nextPage = page + 1;
                setPage(nextPage);
            }
        };

        // window.addEventListener("scroll", handleScroll);
        // return () => window.removeEventListener("scroll", handleScroll);
    }, [page, results, hitsPerPage]);

    return (
        <div className="mt-28">
            {/* Search Input */}
            <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(0); }}
                placeholder="Search products..."
                className="border p-2 mb-4 w-full"
            />

            <div className="flex-1 relative flex flex-col lg:flex-row">
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 stickyx top-[120px]x h-[calc(100vh-120px)]x overflow-y-autox">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    {/* Facets */}
                    <SidebarFilters
                        facets={results.facets}
                        currentRefinements={selectedFacets}
                    />
                    {/* {results.facets &&
                        Object.entries(results.facets).map(([facetName, counts]) => (
                            <div key={facetName}>
                                <h4 className="font-semibold">{facetName}</h4>
                                {Object.entries(counts).map(([value, count]) => (
                                    <label key={value} className="block">
                                        <input
                                            type="checkbox"
                                            checked={selectedFacets[facetName]?.includes(value) || false}
                                            onChange={() => updateFacet(facetName, value)}
                                            className="mr-1"
                                        />
                                        {value} ({count})
                                    </label>
                                ))}
                            </div>
                        ))} */}
                </aside>

                <main className="flex-1 space-y-2 bg-gray-100 p-4">
                    {/* Results */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                        {results.hits.map((hit: any) => (
                            <VehicleCard key={hit.objectID} hit={hit} />
                        ))}
                    </div>

                    {/* Loading */}
                    {loadingRef.current && <div className="text-center p-4">Loading...</div>}
                </main>
            </div>


        </div>
    );
}
