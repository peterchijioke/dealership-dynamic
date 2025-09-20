"use client";

import { useState, useMemo, useCallback } from "react";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import {
  generateFacetFilters,
  searchWithMultipleQueries,
} from "@/lib/algolia";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActiveFiltersBar from "./active-filters";
import { useAlgolia, useAllRefinements } from "@/hooks/useAlgolia";
import {
  algoliaSortOptions,
  CATEGORICAL_FACETS,
  searchClient,
  srpIndex,
} from "@/configs/config";
import SortDropdown from "./sort-opptions";
import { useInfiniteAlgoliaHits } from "@/hooks/useInfiniteAlgoliaHits";
import { urlParser2 } from "@/lib/url-formatter";
import SearchDropdown, { CustomSearchBox } from "./search-modal";
import { InstantSearch } from "react-instantsearch";
import CarouselBanner from "@/components/inventory/CarouselBanner";

interface Props {
  initialResults: any;
  refinements?: Record<string, string[]>; // ex: { condition: ["New"], make: ["Audi"] }
}

const HITS_PER_PAGE = 12;

export default function SearchClient({
  initialResults,
  refinements = {},
}: Props) {
  const [selectedFacets, setSelectedFacets] =
    useState<Record<string, string[]>>(refinements);
  const [sortIndex, setSortIndex] = useState(algoliaSortOptions[0].value);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const { stateToRoute } = useAlgolia();

  // Infinite hits hook
  const { hits, totalHits, facets: latestFacets, setFacets, showMore, isLastPage, loading } =
    useInfiniteAlgoliaHits({
      initialHits: initialResults.hits,
      initialTotalHits: initialResults.nbHits,
      initialFacets: initialResults.facets,
      // initialPage: initialResults.page,
      refinements: selectedFacets,
      sortIndex,
      hitsPerPage: HITS_PER_PAGE,
    });

  // Toggle a facet
  const updateFacet = async (facet: string, value: string) => {
    let currentFacets = selectedFacets;
    setSelectedFacets((prev) => {
      const current = prev[facet] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const newState = { ...prev, [facet]: updated };
      if (newState[facet].length === 0) delete newState[facet];

      // Auto-select make when model is toggled
      if (facet === "model" && !prev.make) {
        const firstMakeKey = Object.keys(latestFacets.make || {})[0];
        if (firstMakeKey) {
          newState.make = [firstMakeKey];
        }
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

    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: generateFacetFilters(selectedFacets),
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

    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: generateFacetFilters(selectedFacets),
      sortIndex: newSort,
      facets: CATEGORICAL_FACETS,
    });

    setFacets(res.facets);
  };

  return (
    <div className="w-full h-svh m:pt-28 md:pt-32">
      <div className="h-full flex overflow-hidden">
        <aside className="hidden lg:block w-72 shrink-0 bg-[#FAF9F7]">
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
        </aside>

        <main className="h-full flex-1 flex flex-col">
          <ScrollArea className="h-full  ">
            <div className=" w-full px-3">
              <CarouselBanner className=" rounded-2xl" />
            </div>
            <div className="p-4 space-y-4">
              <div className="w-full flex py-4  flex-col gap-2">
                <div className="w-full flex items-center md:flex-row gap-2">
                  <div className="hidden md:block w-1/3">
                    <span>{totalHits} vehicles found for sale</span>
                  </div>
                  <InstantSearch
                    indexName={srpIndex}
                    searchClient={searchClient}
                  >
                    <div className="relative w-full z-50 pointer-events-auto">
                      <CustomSearchBox setSearchOpen={setSearchOpen} />
                      <SearchDropdown
                        isOpen={isSearchOpen}
                        onClose={() => setSearchOpen(false)}
                      />
                    </div>
                  </InstantSearch>
                  {/* Sort dropdown */}
                  <SortDropdown
                    currentSort={sortIndex}
                    onChange={handleSortChange}
                  />
                </div>
                <div className="block md:hidden">
                  <span className=" text-sm ">
                    1438 vehicles found for sale
                  </span>
                </div>
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
        </main>
      </div>
    </div>
  );
}
