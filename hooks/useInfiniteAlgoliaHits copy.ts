import { useState, useEffect, useCallback } from "react";
import type { VehicleHit } from "@/types/vehicle";
import { searchWithMultipleQueries } from "@/lib/algolia";

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

  // Normalize facetFilters for Algolia
  const buildFacetFilters = useCallback(() => {
    return Object.entries(refinements)
      .filter(([_, values]) => values.length > 0)
      .map(([facet, values]) => values.map((v) => `${facet}:${v}`));
  }, [refinements]);

  // Reset hits when refinements change
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const response = await searchWithMultipleQueries({
          page: 0,
          hitsPerPage,
          facetFilters: buildFacetFilters(),
          sortIndex,
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
  }, [buildFacetFilters]);

  // Infinite scroll "show more"
  const showMore = useCallback(async () => {
    if (loading || isLastPage) return;
    setLoading(true);

    const response = await searchWithMultipleQueries({
      page: page + 1,
      hitsPerPage,
      facetFilters: buildFacetFilters(),
      sortIndex,
    });

    if (!response?.hits || response.hits.length === 0) {
      setIsLastPage(true);
    } else {
      setHits((prev) => [...prev, ...(response.hits as VehicleHit[])]);
      setPage((p) => p + 1);
      setIsLastPage((response.page ?? 0) + 1 >= (response.nbPages ?? 0));
    }

    setLoading(false);
  }, [page, loading, isLastPage, buildFacetFilters]);

  return { hits, isLastPage, showMore, loading };
}
