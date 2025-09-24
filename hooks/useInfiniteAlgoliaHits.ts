import { useState, useEffect, useCallback } from "react";
import type { VehicleHit } from "@/types/vehicle";
import {
  normalizeRefinementForAlgolia,
  refinementToFacetFilters,
  searchWithMultipleQueries,
} from "@/lib/algolia";
import { CATEGORICAL_FACETS } from "@/configs/config";

type UseInfiniteAlgoliaHitsProps = {
  initialHits: VehicleHit[];
  initialTotalHits?: number;
  initialFacets?: { [key: string]: { [key: string]: number } };
  initialPage?: number;
  refinements?: Record<string, string[]>; // ex: { condition: ["New"], make: ["Audi"] }
  sortIndex?: string;
  hitsPerPage?: number;
};

export function useInfiniteAlgoliaHits({
  initialHits,
  initialTotalHits = 0,
  initialFacets = {},
  initialPage = 0,
  refinements = {},
  hitsPerPage = 12,
  sortIndex,
}: UseInfiniteAlgoliaHitsProps) {
  const [totalHits, setTotalHits] = useState(initialTotalHits);
  const [hits, setHits] = useState<VehicleHit[]>(initialHits);
  const [page, setPage] = useState(initialPage);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [facets, setFacets] = useState(initialFacets);

  // Build facetFilters for Algolia
  const buildFacetFilters = useCallback(() => {
    return refinementToFacetFilters(refinements);
  }, [refinements]);

  // Reset hits when refinements, sortIndex, or hitsPerPage change
  useEffect(() => {
    if (!refinements || Object.keys(refinements).length === 0) return;

    if (!initialized) {
      // Skip first run, trust initialHits
      setInitialized(true);
      return;
    }

    let active = true;
    (async () => {
      setLoading(true);
      try {
        const normalizedRefinement = normalizeRefinementForAlgolia(refinements);
        const response = await searchWithMultipleQueries({
          page: 0,
          hitsPerPage,
          facetFilters: refinementToFacetFilters(normalizedRefinement),
          sortIndex,
          facets: CATEGORICAL_FACETS,
        });

        // console.log("useEffect:", response);

        if (!active) return;

        setTotalHits(response.nbHits ?? 0);
        setHits(response.hits as VehicleHit[]);
        setFacets(response.facets);
        setPage(0);
        setIsLastPage((response?.page ?? 0) + 1 >= (response?.nbPages ?? 0));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [buildFacetFilters, sortIndex, hitsPerPage]);

  // Infinite scroll: fetch next page
  const showMore = useCallback(async () => {
    if (loading || isLastPage) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const normalizedRefinement = normalizeRefinementForAlgolia(refinements);
      const response = await searchWithMultipleQueries({
        page: nextPage,
        hitsPerPage,
        facetFilters: refinementToFacetFilters(normalizedRefinement),
        sortIndex,
        facets: CATEGORICAL_FACETS,
      });

      if (!response?.hits || response.hits.length === 0) {
        setIsLastPage(true);
      } else {
        setTotalHits(response.nbHits ?? 0);
        setHits((prev) => [...prev, ...(response.hits as VehicleHit[])]);
        setFacets(response.facets);
        setPage(nextPage);
        setIsLastPage((response.page ?? 0) + 1 >= (response.nbPages ?? 0));
      }
    } finally {
      setLoading(false);
    }
  }, [page, loading, isLastPage, buildFacetFilters, hitsPerPage, sortIndex]);

  return { hits, totalHits, facets, setFacets, isLastPage, showMore, loading };
}
