import { useState, useEffect, useCallback } from "react";
import type { VehicleHit } from "@/types/vehicle";
import { refinementToFacetFilters, searchWithMultipleQueries } from "@/lib/algolia";
import { CATEGORICAL_FACETS } from "@/configs/config";

type UseInfiniteAlgoliaHitsProps = {
  initialHits: VehicleHit[];
  initialPage?: number;
  refinements?: Record<string, string[]>; // ex: { condition: ["New"], make: ["Audi"] }
  sortIndex?: string;
  hitsPerPage?: number;
};

export function useInfiniteAlgoliaHits({
  initialHits,
  initialPage = 0,
  refinements = {},
  hitsPerPage = 12,
  sortIndex,
}: UseInfiniteAlgoliaHitsProps) {
  const [hits, setHits] = useState<VehicleHit[]>(initialHits);
  const [page, setPage] = useState(initialPage);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Build facetFilters for Algolia
  const buildFacetFilters = useCallback(() => {
    return refinementToFacetFilters(refinements);
  }, [refinements]);

  const buildFacetFiltersx = useCallback(() => {
    return Object.entries(refinements)
      .filter(([_, values]) => values.length > 0)
      .map(([facet, values]) =>
        values.map((v) => {
          if (facet === "is_special") {
            return `${facet}:${String(v)}`; // ensures "true" not true
          }
          return `${facet}:${v}`;
        })
      );
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
        const response = await searchWithMultipleQueries({
          page: 0,
          hitsPerPage,
          facetFilters: buildFacetFilters(),
          sortIndex,
          facets: CATEGORICAL_FACETS,
        });

        if (!active) return;

        setHits(response.hits as VehicleHit[]);
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
      const response = await searchWithMultipleQueries({
        page: nextPage,
        hitsPerPage,
        facetFilters: buildFacetFilters(),
        sortIndex,
        facets: CATEGORICAL_FACETS,
      });

      if (!response?.hits || response.hits.length === 0) {
        setIsLastPage(true);
      } else {
        setHits((prev) => [...prev, ...(response.hits as VehicleHit[])]);
        setPage(nextPage);
        setIsLastPage((response.page ?? 0) + 1 >= (response.nbPages ?? 0));
      }
    } finally {
      setLoading(false);
    }
  }, [page, loading, isLastPage, buildFacetFilters, hitsPerPage, sortIndex]);

  return { hits, isLastPage, showMore, loading };
}
