"use client";

import { useEffect, useRef } from "react";
import VehicleCard from "@/components/vehicle/vehicle-card";
import type { VehicleHit } from "@/types/vehicle";
import { useInfiniteAlgoliaHits } from "@/hooks/useInfiniteAlgoliaHits";

export default function InfiniteHits({
  serverHits,
  refinements,
}: {
  serverHits: VehicleHit[];
  refinements: Record<string, string[]>;
}) {
  const { hits, isLastPage, showMore, loading } = useInfiniteAlgoliaHits({
    initialHits: serverHits,
    refinements,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLastPage) {
          showMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [isLastPage, showMore]);

  return (
    <div className="">
      <div className=" w-full flex-1 flex flex-col md:flex-row gap-2">
        {/* <input
          type="text"
          // value={query}
          onChange={(e) => {
            //   setQuery(e.target.value);
            //   setPage(0);
          }}
          placeholder="Search products..."
          className="border outline-none p-2 flex-1 w-full rounded-lg"
        />
        <button className=" bg-rose-700 hover:bg-rose-800 p-3 rounded-lg cursor-pointer w-full h-full">
          <Filter className="size-4 text-white" />
        </button> */}
      </div>
      <div className="vehicle-grid w-full min-h-[400px] grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {(hits || []).map((hit) => (
          <VehicleCard key={hit.objectID} hit={hit as any} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-12 flex justify-center items-center">
        {loading && (
          <span className="text-gray-500 text-sm">Loading more...</span>
        )}
        {/* {isLastPage && (
          <span className="text-gray-400 text-sm">No more results</span>
        )} */}
      </div>
    </div>
  );
}
