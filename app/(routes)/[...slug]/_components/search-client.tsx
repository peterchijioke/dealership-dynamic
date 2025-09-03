"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SearchResponse } from "algoliasearch";
import type { VehicleHit } from "@/types/vehicle";
import SidebarFilters from "./sidebar-filters";
import VehicleCard from "@/components/vehicle-card";
import { searchWithMultipleQueries } from "@/lib/algolia";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import { Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // ✅ import from shadcn

interface Props {
  initialResults: any; // SearchResponse<VehicleHit[]>
}

export default function SearchClient({ initialResults }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const initialSlug = pathname.split("/").filter(Boolean);
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

  const mainScrollRef = useRef<HTMLDivElement | null>(null);

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

      const results = await searchWithMultipleQueries({
        hitsPerPage,
        facetFilters,
        facets: ["*"],
        attributesToRetrieve: ["*"],
        page: currentPage,
        query,
      });

      setResults((prev: any) => ({
        ...results,
        hits: append ? [...(prev?.hits ?? []), ...results.hits] : results.hits,
      }));

      loadingRef.current = false;
    },
    [query, selectedFacets]
  );

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    fetchResults(page, page > 0);
  }, [query, selectedFacets, page, fetchResults]);

  return (
    <div className="pt-28">
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
              facets={results?.facets}
              currentRefinements={selectedFacets}
              onToggleFacet={updateFacet}
            />
          </ScrollArea>
        </aside>

        {/* MAIN with ScrollArea */}
        <main className="flex-1 bg-gray-100">
          <ScrollArea ref={mainScrollRef} className="h-full">
            <div className="p-4 space-y-4">
              <div className="w-full flex flex-col md:flex-row gap-2">
                <input
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                  }}
                  type="text"
                  placeholder="Search products..."
                  className="border outline-none p-2 flex-1 rounded-lg bg-white"
                  defaultValue={initialQuery}
                />
                <button className="bg-rose-700 hover:bg-rose-800 p-3 rounded-lg cursor-pointer shrink-0">
                  <Filter className="size-4 text-white" />
                </button>
              </div>

              <InfiniteHits
                serverHits={results?.hits ?? []}
                refinements={selectedFacets}
              />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
