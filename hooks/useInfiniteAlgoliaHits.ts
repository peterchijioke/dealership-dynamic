import { useState, useEffect, useCallback } from "react";
import type { Vehicle, VehicleHit } from "@/types/vehicle";
import { searchWithMultipleQueries } from "@/lib/algolia";

type UseInfiniteAlgoliaHitsProps = {
  initialHits: VehicleHit[];
  initialPage?: number;
  refinements?: Record<string, string[]>; // condition: ["New"], make: ["Honda"]
};

export function useInfiniteAlgoliaHits({
  initialHits,
  initialPage = 0,
  refinements = {},
}: UseInfiniteAlgoliaHitsProps) {
  const [hits, setHits] = useState<VehicleHit[]>(initialHits);
  const [page, setPage] = useState(initialPage);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset when refinements change
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const response = await searchWithMultipleQueries({
        page: 0,
        hitsPerPage: 20,
        facetFilters: Object.entries(refinements).map(
          ([facet, values]) => values.map((v) => `${facet}:${v}`)
        ),
      });

      if (!active) return;
      setHits(response.hits as VehicleHit[]);
      setPage(0);
      setIsLastPage((response?.page ?? 0) + 1 >= (response?.nbPages ?? 0));
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [JSON.stringify(refinements)]); // deep dependency

  const showMore = useCallback(async () => {
    if (loading || isLastPage) return;
    setLoading(true);

    const response = await searchWithMultipleQueries({
      page: page + 1,
      hitsPerPage: 20,
      facetFilters: Object.entries(refinements).map(([facet, values]) =>
        values.map((v) => `${facet}:${v}`)
      ),
    });

    if (response.hits.length === 0) {
      setIsLastPage(true);
    } else {
      setHits((prev) => [...prev, ...(response.hits as VehicleHit[])]);
      setPage((p) => p + 1);
      setIsLastPage((response?.page ?? 0) + 1 >= (response?.nbPages ?? 0));
    }
    setLoading(false);
  }, [page, loading, isLastPage, refinements]);

  return { hits, isLastPage, showMore, loading };
}
