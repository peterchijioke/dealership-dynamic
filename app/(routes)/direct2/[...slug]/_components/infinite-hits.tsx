"use client";

import { useEffect, useRef } from "react";
import { useInfiniteHits } from "react-instantsearch";
import VehicleCard from "./vehicle-card";
import type { Vehicle } from "@/types/vehicle";

export default function InfiniteHits({
  serverHits,
}: {
  serverHits: Vehicle[];
}) {
  const { items: hits, isLastPage, showMore } = useInfiniteHits<Vehicle>();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // console.log("serverHits:", serverHits);
  // console.log("InfiniteHits:", hits);

  // IntersectionObserver to trigger loading next page
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
      { rootMargin: "200px" } // preload before reaching bottom
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [isLastPage, showMore]);

  return (
    <div className="space-y-6">
      {/* Grid of hits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {hits.length > 0
          ? hits.map((hit) => <VehicleCard key={hit.objectID} hit={hit} />)
          : serverHits.map((hit) => (
              <VehicleCard key={hit.objectID} hit={hit} />
            ))}
      </div>

      {/* Sentinel div for infinite scroll */}
      <div ref={sentinelRef} className="h-12 flex justify-center items-center">
        {!isLastPage && (
          <span className="text-gray-500 text-sm">Loading more...</span>
        )}
        {isLastPage && (
          <span className="text-gray-400 text-sm">No more results</span>
        )}
      </div>
    </div>
  );
}
