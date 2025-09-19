"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "@/components/algolia/infinite-hits-2";
import {
  refinementToFacetFilters,
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
import SpecialBanner from "@/components/layouts/SpecialBanner";
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
  const [facets, setFacets] = useState(initialResults.facets);
  const [sortIndex, setSortIndex] = useState(algoliaSortOptions[0].value);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const { refinements: filterRefinements } = useAllRefinements();
  const { stateToRoute } = useAlgolia();

  // Infinite hits hook
  const { hits, totalHits, showMore, isLastPage, loading } =
    useInfiniteAlgoliaHits({
      initialHits: initialResults.hits,
      initialTotalHits: initialResults.nbHits,
      refinements: selectedFacets,
      sortIndex,
      hitsPerPage: HITS_PER_PAGE,
    });

  // Helper: build Algolia facetFilters array from selected facets
  const buildFacetFilters = useCallback(
    (facetsOverride?: Record<string, string[]>) => {
      const source = facetsOverride ?? selectedFacets;
      return Object.entries(source)
        .filter(([_, vals]) => vals.length > 0)
        .map(([f, vals]) => vals.map((v) => `${f}:${v}`));
    },
    [selectedFacets]
  );

  // Sync state with URL back/forward
  useEffect(() => {
    const handlePopState = () => {
      console.log("Popstate detected, syncing state with URL");
      const searchParamsObj = new URLSearchParams(window.location.search);
      const { params: newRefinements } = urlParser2(
        window.location.pathname,
        searchParamsObj
      );
      setSelectedFacets(newRefinements);

      // Refetch facets counts
      searchWithMultipleQueries({
        hitsPerPage: HITS_PER_PAGE,
        facetFilters: refinementToFacetFilters(newRefinements),
        sortIndex,
        facets: CATEGORICAL_FACETS,
      }).then((res) => setFacets(res.facets));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [sortIndex]);

  // Toggle a facet
  const updateFacet = async (facet: string, value: string) => {
    setSelectedFacets((prev) => {
      const current = prev[facet] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const newState = { ...prev, [facet]: updated };
      if (newState[facet].length === 0) delete newState[facet];

      stateToRoute(newState); // push URL change
      return newState;
    });

    // Refetch facet counts
    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: buildFacetFilters(),
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

      stateToRoute(updated); // push URL change
      return updated;
    });

    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: buildFacetFilters(),
      sortIndex,
      facets: CATEGORICAL_FACETS,
    });
    setFacets(res.facets);
  };

  const handleReset = async () => {
    const defaultRefinements = { condition: ["New"] };
    setSelectedFacets(defaultRefinements);
    stateToRoute(defaultRefinements); // replaceState to avoid extra history entry

    const res = await searchWithMultipleQueries({
      hitsPerPage: HITS_PER_PAGE,
      facetFilters: buildFacetFilters(defaultRefinements),
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
              facets={sidebarFacets}
              currentRefinements={selectedFacets}
              onToggleFacet={updateFacet}
            />
          </ScrollArea>
        </aside>

        <main className="h-full">
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
