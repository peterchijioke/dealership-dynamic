"use client";

import { cn } from "@/lib/utils";
import { useUrlFilters } from "@/hooks/useUrlFilters";

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
    const { filters, setFilter } = useUrlFilters();
    const selected = filters[attribute]?.split(",") ?? [];
    // const selected = selectedFacets[attribute] || [];

    function toggle(value: string) {
        // Update state
        updateFacet(attribute, value);

        // Update URL filter
        const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];

        setFilter(attribute, next);
    }

    return (
        <div className={cn("w-full", className)}>
            {searchable && values.length > 5 && (
                <input
                    type="text"
                    placeholder={`Search ${attribute}...`}
                    onChange={(e) => {
                        // You can wire this to filter values list client-side
                    }}
                    className="w-full border rounded px-2 py-1 text-sm mb-2"
                />
            )}

            <ul className="space-y-1 max-h-60 overflow-y-auto">
                {Object.entries(values).map(([value, count]) => {
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
                                <span className="text-xs text-gray-500">
                                    {count}
                                </span>
                            </label>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}
