"use client";

import { useState, useMemo } from "react";
import type { VehicleHit } from "@/types/vehicle";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import { searchWithMultipleQueries } from "@/lib/algolia";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";

interface Props {
  initialResults: any; // from server (SearchResponse<VehicleHit>)
  refinements?: Record<string, string[]>; // condition: ["New"], make: ["Audi"]
}

export default function SearchClient({
  initialResults,
  refinements = {},
}: Props) {
  // Local refinements (can be toggled in sidebar)
  const [selectedFacets, setSelectedFacets] =
    useState<Record<string, string[]>>(refinements);

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
              <div className="w-full flex flex-col md:flex-row gap-2">
                <input
                  onChange={(e) => {
                    // setQuery(e.target.value);
                    // setPage(0);
                  }}
                  type="text"
                  placeholder="Search products..."
                  className="border outline-none p-2 flex-1 rounded-lg bg-white"
                  //   defaultValue={initialQuery}
                />
                <button className="bg-rose-700 hover:bg-rose-800 p-3 rounded-lg cursor-pointer shrink-0">
                  <Filter className="size-4 text-white" />
                </button>
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
