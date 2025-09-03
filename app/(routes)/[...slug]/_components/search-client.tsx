"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SearchResponse } from "algoliasearch";
import type { VehicleHit } from "@/types/vehicle";
import SidebarFilters from "./sidebar-filters";
import { ATTRUBUTES_TO_RETRIEVE, FACETS } from "@/configs/config";
import VehicleCard from "@/components/vehicle-card";
import { searchWithMultipleQueries } from "@/lib/algolia";
import InfiniteHits from "@/components/algolia/infinite-hits-2";

interface Props {
  // initialResults: SearchResponse<VehicleHit[]>;
  initialResults: any;
}

export default function SearchClient({ initialResults }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize query from the current slug
  const initialSlug = pathname.split("/").filter(Boolean); // e.g., /brand/nike/shirts → ["brand","nike","shirts"]
  const initialQuery = initialSlug.join(" ");

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(initialResults);
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >({});
  const [page, setPage] = useState(0);
  const hitsPerPage = 12;
  const loadingRef = useRef(false);
  const didMountRef = useRef(false);

  const updateFacet = (facet: string, value: string) => {
    setSelectedFacets((prev) => {
      const current = prev[facet] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
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
        .map(([facet, values]) => values.map((v) => `${facet}:${v}`));

      const params = new URLSearchParams();
      // if (query) params.append("query", query);
      params.append("hitsPerPage", hitsPerPage.toString());
      params.append("page", currentPage.toString());
      params.append("facets", JSON.stringify(["*"]));
      params.append("attributesToRetrieve", JSON.stringify(["*"]));
      // params.append("facets", JSON.stringify(FACETS));
      // params.append(
      //     "attributesToRetrieve",
      //     JSON.stringify(ATTRUBUTES_TO_RETRIEVE)
      // );

      if (facetFilters.length) {
        params.append(
          "facetFilters",
          facetFilters.map((f) => f.join(";")).join(",")
        );
      }

      const res = await fetch(`/api/search?${params.toString()}`);
      const data: SearchResponse<VehicleHit[]> = await res.json();

      const results = await searchWithMultipleQueries({
        // query: searchQuery,
        hitsPerPage: 12,
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
    [query, selectedFacets, router]
  );

  // Fetch on query/facets/page change
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return; // skip the first effect run
    }
    fetchResults(page, page > 0);
  }, [query, selectedFacets, page, fetchResults]);

  return (
    <div className="mt-28">
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
        }}
        placeholder="Search products..."
        className="border p-2 mb-4 w-full"
      />

      <div className="flex-1 relative flex flex-col lg:flex-row">
        <aside className="inventory-sidebar-filter min-h-screen hidden w-75 shrink-0 lg:block">
          <h2 className="font-bold text-center uppercase">Search Filters</h2>
          {/* Facets */}
          <SidebarFilters
            facets={results.facets}
            currentRefinements={selectedFacets}
            onToggleFacet={updateFacet}
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

        <main className="flex-1 space-y-2 bg-[#FAF9F7] p-4">
          {/* Results */}
          <InfiniteHits
            serverHits={results.hits}
            refinements={selectedFacets}
          />
        </main>
      </div>
    </div>
  );
}
