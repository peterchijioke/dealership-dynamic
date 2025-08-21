"use client";

import { cn } from "@/lib/utils";
import { useAlgolia } from "@/hooks/useAlgolia";
import { useMemo, useState } from "react";
import { updateFacetFilter } from "@/lib/algolia";

type Props = {
    attribute: string;
    values: Record<string, number>; // e.g. { "Toyota": 12, "Honda": 5 }
    selectedFacets: Record<string, string[]>;
    updateFacet: (attribute: string, value: string) => void;
    searchable?: boolean;
    className?: string;
};

export default function CustomRefinementList({
    attribute,
    values,
    selectedFacets,
    updateFacet,
    searchable,
    className,
}: Props) {
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);
    const { stateToRoute } = useAlgolia();

    const selected = selectedFacets[attribute] || [];

    // Always normalize to string[]
    // const selected = Array.isArray(selectedFacets[attribute])
    //     ? (selectedFacets[attribute] as string[])
    //     : selectedFacets[attribute]
    //         ? (selectedFacets[attribute] as string).split(",")
    //         : [];

    // Filter by search (case-insensitive)
    const filtered = useMemo(() => {
        const entries = Object.entries(values);
        if (!search.trim()) return entries;
        return entries.filter(([value]) =>
            value.toLowerCase().includes(search.toLowerCase())
        );
    }, [values, search]);

    // Show first 10 or all
    const visibleValues = showAll ? filtered : filtered.slice(0, 10);

    function toggle(value: string) {
        // Update state
        updateFacet(attribute, value);

        // Update URL filter
        // const next = selected.includes(value)
        //     ? selected.filter((v) => v !== value)
        //     : [...selected, value];
        
        const updated = updateFacetFilter(selectedFacets, attribute, value);

        stateToRoute(updated);
    }

    return (
        <div className={cn("w-full", className)}>
            {searchable && Object.keys(values).length > 5 && (
                <input
                    type="text"
                    placeholder={`Search ${attribute}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm mb-2"
                />
            )}

            <ul className="space-y-1 max-h-60 overflow-y-auto">
                {visibleValues.map(([value, count]) => {
                    const isChecked = selected.includes(value);

                    return (
                        <li key={value}>
                            <label className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggle(value)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm">{value}</span>
                                </div>
                                <span className="text-xs text-gray-500">{count}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>

            {/* Show more/less */}
            {Object.keys(filtered).length > 10 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-3 text-red-500 text-sm font-medium"
                >
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
}
