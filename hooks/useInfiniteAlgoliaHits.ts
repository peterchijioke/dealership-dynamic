import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  initialFacets?: Record<string, Record<string, number>>;
  initialPage?: number;
  refinements?: Record<string, string[]>;
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
  const [state, setState] = useState({
    hits: initialHits,
    totalHits: initialTotalHits,
    facets: initialFacets,
    page: initialPage,
    isLastPage: false,
    loading: false,
  });

  const abortRef = useRef<AbortController | null>(null);

  // Memoize filters so they're stable across re-renders
  const facetFilters = useMemo(() => {
    const normalized = normalizeRefinementForAlgolia(refinements);
    return refinementToFacetFilters(normalized);
  }, [refinements]);

  // Reset hits when refinements/sort/page size change
  useEffect(() => {
    if (!refinements || Object.keys(refinements).length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true }));

    (async () => {
      try {
        const response = await searchWithMultipleQueries({
          page: 0,
          hitsPerPage,
          facetFilters,
          sortIndex,
          facets: CATEGORICAL_FACETS,
        });

        if (controller.signal.aborted) return;

        setState({
          hits: response.hits as VehicleHit[],
          totalHits: response.nbHits ?? 0,
          facets: response.facets ?? {},
          page: 0,
          isLastPage: (response.page ?? 0) + 1 >= (response.nbPages ?? 0),
          loading: false,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Algolia fetch error", err);
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    })();

    return () => controller.abort();
  }, [facetFilters, sortIndex, hitsPerPage]);

  // Infinite scroll
  const showMore = useCallback(async () => {
    if (state.loading || state.isLastPage) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true }));

    const nextPage = state.page + 1;

    try {
      const response = await searchWithMultipleQueries({
        page: nextPage,
        hitsPerPage,
        facetFilters,
        sortIndex,
        facets: CATEGORICAL_FACETS,
      });

      if (controller.signal.aborted) return;

      setState((prev) => ({
        ...prev,
        hits: response.hits?.length
          ? [...prev.hits, ...(response.hits as VehicleHit[])]
          : prev.hits,
        totalHits: response.nbHits ?? prev.totalHits,
        facets: response.facets ?? prev.facets,
        page: nextPage,
        isLastPage: (response.page ?? nextPage) + 1 >= (response.nbPages ?? 0),
        loading: false,
      }));
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Algolia fetch error", err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    }
  }, [
    state.page,
    state.isLastPage,
    state.loading,
    facetFilters,
    hitsPerPage,
    sortIndex,
  ]);

  return {
    ...state,
    showMore,
    setFacets: (f: any) => setState((prev) => ({ ...prev, facets: f })),
  };
}
