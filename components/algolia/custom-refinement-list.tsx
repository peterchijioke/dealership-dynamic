"use client";

import { cn } from "@/lib/utils";
import { useRefinementList } from "react-instantsearch";

type Props = {
    attribute: string;
    searchable?: boolean;
    className?: string;
    serverFacets?: Record<string, any>;
    skipSuspense?: boolean;
};

export default function CustomRefinementList({ attribute, searchable, className, serverFacets, skipSuspense=false }: Props) {
    const {
        items,
        refine,
        canToggleShowMore,
        isShowingMore,
        toggleShowMore,
        searchForItems
    } = useRefinementList({ attribute, limit: 10, showMoreLimit: 20 }, { skipSuspense });

    // Fallback: use server facets if client items are not ready
    const displayItems = items.length > 0
        ? items
        : (serverFacets?.[attribute]
            ? Object.entries(serverFacets[attribute]).map(([label, count]) => ({
                label,
                value: label,
                count,
                isRefined: false,
            }))
            : []);
    
    return (
        <div className={cn("w-full", className)}>
            {/* Custom search input */}
            {searchable && displayItems.length > 5 && <div>
                <input
                    type="text"
                    placeholder={`Search ${attribute}...`}
                    onChange={(e) => searchForItems(e.currentTarget.value)}
                    className="w-full border rounded px-2 py-1 text-sm mb-2"
                />
            </div>}

            {/* Custom list UI */}
            <ul className="space-y-1 max-h-60 overflow-y-auto">
                {displayItems.map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={item.isRefined}
                                onChange={() => refine(item.value)}
                                className="h-4 w-4"
                            />
                            <span className="text-sm">{item.label}</span>
                        </label>
                        <span className="text-xs text-gray-500">{String(item.count)}</span>
                    </li>
                ))}
            </ul>

            {/* Show More / Show Less */}
            {canToggleShowMore && (
                <button
                    onClick={toggleShowMore}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                >
                    {isShowingMore ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
}
