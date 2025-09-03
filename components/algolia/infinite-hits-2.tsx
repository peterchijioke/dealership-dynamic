"use client";

import { useEffect, useRef } from "react";
import VehicleCard from "@/components/vehicle-card";
import type { VehicleHit } from "@/types/vehicle";
import { useInfiniteAlgoliaHits } from "@/hooks/useInfiniteAlgoliaHits";
import { Filter } from "lucide-react";

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
    <div className=" w-full">
      {/* 🔹 Search + Filter Row */}

      {/* 🔹 Vehicle Grid */}
      <div className="vehicle-grid styles_VehicleGrid__phGR8">
        {hits.map((hit) => (
          <VehicleCard key={hit.objectID} hit={hit as any} />
        ))}
      </div>

      {/* 🔹 Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-12 flex justify-center items-center">
        {loading && (
          <span className="text-gray-500 text-sm">Loading more...</span>
        )}
        {isLastPage && (
          <span className="text-gray-400 text-sm">No more results</span>
        )}
      </div>
    </div>
  );
}
