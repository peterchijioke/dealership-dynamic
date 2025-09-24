"use client";
import "./search-client-scroll-lock.css";

import { useState } from "react";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import { generateFacetFilters, normalizeRefinementForAlgolia, searchWithMultipleQueries } from "@/lib/algolia";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActiveFiltersBar from "./active-filters";
import { useAlgolia } from "@/hooks/useAlgolia";
import {
  algoliaSortOptions,
  CATEGORICAL_FACETS,
  searchClient,
  srpIndex,
} from "@/configs/config";
import SortDropdown from "./sort-opptions";
import { useInfiniteAlgoliaHits } from "@/hooks/useInfiniteAlgoliaHits";
import SearchDropdown, { CustomSearchBox } from "./search-modal";
import { InstantSearch } from "react-instantsearch";
// import CarouselBanner from "@/components/inventory/CarouselBanner";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import dynamic from "next/dynamic";

// const SidebarFilters = dynamic(() => import("./sidebar-filters"), { ssr: false });
// const InfiniteHits = dynamic(() => import("@/components/algolia/infinite-hits-2"), { ssr: false });
const CarouselBanner = dynamic(() => import("@/components/inventory/CarouselBanner"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  resultHits: any;
  nbHits: number;
  facets: any;
  refinements?: Record<string, string[]>; // ex: { condition: ["New"], make: ["Audi"] }
}

const HITS_PER_PAGE = 12;

export default function SearchClient({
  resultHits,
  nbHits,
  facets,
  refinements = {},
}: Props) {
  const [selectedFacets, setSelectedFacets] =
    useState<Record<string, string[]>>(refinements);
  const [sortIndex, setSortIndex] = useState(algoliaSortOptions[0].value);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);

  const { stateToRoute } = useAlgolia();

  // Infinite hits hook
  const {
    hits,
    totalHits,
    facets: latestFacets,
    setFacets,
    showMore,
    isLastPage,
    loading,
  } = useInfiniteAlgoliaHits({
    initialHits: resultHits,
    initialTotalHits: nbHits,
    initialFacets: facets,
    // initialPage: initialResults.page,
    refinements: selectedFacets,
    sortIndex,
    hitsPerPage: HITS_PER_PAGE,
  });

  // Toggle a facet  
  const updateFacet = async (
    facet: string,
    value: string,
  ) => {
    let currentFacets = selectedFacets;

    setSelectedFacets((prev) => {
      const current = prev[facet] || [];

      // Toggle facet value
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const newState = { ...prev, [facet]: updated };
      if (newState[facet].length === 0) delete newState[facet];

      // Auto-select make when model is toggled (unchanged)
      if (facet === "model" && !prev.make) {
        const firstMakeKey = Object.keys(latestFacets.make || {})[0];
        if (firstMakeKey) {
          newState.make = [firstMakeKey];
        }
      }

      // ---- Remove associated trims when a model is being UNCHECKED ----
      if (facet === "model" && current.includes(value)) {
        const trims = newState.trim || [];
        // Remove any trim that starts with `Model+`, e.g. "Frontier+SV"
        const prefix = `${value}+`;
        newState.trim = trims.filter((t) => !t.startsWith(prefix));
        if (newState.trim.length === 0) delete newState.trim;
      }

      currentFacets = newState;
      return newState;
    });

    stateToRoute(currentFacets); // push URL change
  };




  const handleRemoveFilter = async (facet: string, value: string) => {
    let currentFacets = selectedFacets;
    setSelectedFacets((prev) => {
      const updated = {
        ...prev,
        [facet]: (prev[facet] || []).filter((v) => v !== value),
      };
      if (updated[facet].length === 0) delete updated[facet];

      currentFacets = updated;
      return updated;
    });

    const normalizedRefinement = normalizeRefinementForAlgolia(selectedFacets);
    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: generateFacetFilters(normalizedRefinement),
      sortIndex,
      facets: CATEGORICAL_FACETS,
    });

    setFacets(res.facets);
    stateToRoute(currentFacets); // push URL change
  };

  const handleReset = async () => {
    const defaultRefinements = { condition: ["New"] };
    setSelectedFacets(defaultRefinements);

    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: generateFacetFilters(defaultRefinements),
      sortIndex,
      facets: CATEGORICAL_FACETS,
    });

    setFacets(res.facets);
    stateToRoute(defaultRefinements);
  };

  const handleSortChange = async (newSort: string) => {
    setSortIndex(newSort);

    const normalizedRefinement = normalizeRefinementForAlgolia(selectedFacets);
    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: generateFacetFilters(normalizedRefinement),
      sortIndex: newSort,
      facets: CATEGORICAL_FACETS,
    });

    setFacets(res.facets);
  };

  return (
    <div className="w-full h-svh m:pt-28 md:pt-32">
      <div className="h-full flex overflow-hidden">
        <aside className="hidden lg:block w-72 shrink-0 bg-[#FAF9F7]">
          <div
            className="h-full"
            {...(isSearchOpen ? { "data-scroll-locked": true } : {})}
          >
            <ScrollArea className="h-full px-3">
              <div className="p-4">
                <h2 className="font-bold text-center uppercase">
                  Search Filters
                </h2>
              </div>
              <SidebarFilters
                facets={latestFacets}
                currentRefinements={selectedFacets}
                onToggleFacet={updateFacet}
              />
            </ScrollArea>
          </div>
        </aside>

        <main className="h-full flex-1 flex flex-col">
          <div
            className="h-full"
            {...(isSearchOpen ? { "data-scroll-locked": true } : {})}
          >
            <ScrollArea className="h-full pb-8  ">
              <div className=" w-full px-3 md:pt-0 pt-20">
                <CarouselBanner
                  filters={selectedFacets}
                  className=" rounded-2xl"
                />
              </div>
              <div className="p-4 space-y-4">
                <div className="w-full flex py-4  flex-col gap-2">
                  <div className="w-full flex flex-col items-start  md:items-center md:flex-row gap-2">
                    <div className="hidden md:block w-1/3">
                      <span>{totalHits} vehicles found for sale</span>
                    </div>
                    <InstantSearch
                      indexName={srpIndex}
                      searchClient={searchClient}
                    >
                      <div className="relative max-w-7xl w-full z-50 pointer-events-auto">
                        <CustomSearchBox
                          onClose={() => setSearchOpen(false)}
                          setSearchOpen={setSearchOpen}
                        />
                        <SearchDropdown
                          isOpen={isSearchOpen}
                          onClose={() => setSearchOpen(false)}
                        />
                      </div>
                    </InstantSearch>
                    {/* Sort dropdown */}
                    <div className="md:block hidden">
                      <SortDropdown
                        currentSort={sortIndex}
                        onChange={handleSortChange}
                      />
                    </div>
                  </div>
                  <div className=" md:hidden flex gap-2 flex-col">
                    <div className=" flex-1">
                      <span className=" text-sm shrink-0 font-semibold ">
                        {totalHits} vehicles
                      </span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Button
                        className=" rounded-xs flex-1  bg-rose-700 text-white border-rose-700 hover:bg-rose-800 hover:border-rose-800 focus:ring-rose-300"
                        onClick={() => setFilterSheetOpen(true)}
                      >
                        Filter
                        <Filter className="mr-2 h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <SortDropdown
                          currentSort={sortIndex}
                          onChange={handleSortChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Mobile Filter Sheet using shadcn/ui Sheet */}
                  <Sheet
                    open={isFilterSheetOpen}
                    onOpenChange={setFilterSheetOpen}
                  >
                    <SheetContent
                      side="left"
                      className="p-0 w-72 max-w-[80vw] z-[1000]"
                    >
                      <SheetHeader className="border-b">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="overflow-y-auto h-[calc(100vh-56px)] p-4">
                        <SidebarFilters
                          facets={latestFacets}
                          currentRefinements={selectedFacets}
                          onToggleFacet={updateFacet}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <ActiveFiltersBar
                    refinements={selectedFacets}
                    onRemove={handleRemoveFilter}
                    onClearAll={handleReset}
                  />
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
          </div>
        </main>
      </div>
    </div>
  );
}
