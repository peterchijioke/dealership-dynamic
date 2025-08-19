"use client";

import { cn } from "@/lib/utils";
import { useRefinementList } from "react-instantsearch";

type Props = {
    attribute: string;
    searchable?: boolean;
    className?: string;
};

export default function CustomRefinementList({ attribute, searchable, className }: Props) {
    const { items, refine, searchForItems } = useRefinementList({ attribute }, { skipSuspense: true });

    return (
        <div className={cn("w-full", className)}>
            {/* Custom search input */}
            {searchable && items.length > 5 && <div>
                <input
                    type="text"
                    placeholder={`Search ${attribute}...`}
                    onChange={(e) => searchForItems(e.currentTarget.value)}
                    className="w-full border rounded px-2 py-1 text-sm mb-2"
                />
            </div>}

            {/* Custom list UI */}
            <ul className="space-y-1 max-h-60 overflow-y-auto">
                {items.map((item) => (
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
                        <span className="text-xs text-gray-500">{item.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
