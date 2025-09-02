"use client";

import { useEffect, useRef } from "react";
import VehicleCard from "@/components/vehicle-card";
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
                {hits.map((hit) => (
                    <VehicleCard key={hit.objectID} hit={hit as any } />
                ))}
            </div>

            <div ref={sentinelRef} className="h-12 flex justify-center items-center">
                {loading && <span className="text-gray-500 text-sm">Loading more...</span>}
                {/* {isLastPage && (
                    <span className="text-gray-400 text-sm">No more results</span>
                )} */}
            </div>
        </div>
    );
}
