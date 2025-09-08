"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveFiltersBarProps {
    refinements: Record<string, string[]>;
    onRemove: (facet: string, value: string) => void;
    onClearAll: () => void;
}

export default function ActiveFiltersBar({
    refinements,
    onRemove,
    onClearAll,
}: ActiveFiltersBarProps) {
    const hasFilters = Object.keys(refinements).length > 0;

    if (!hasFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {Object.entries(refinements).map(([facet, values]) =>
                values.map((value) => (
                    <span
                        key={`${facet}-${value}`}
                        className="px-3 py-1 text-sm rounded-full bg-rose-100 text-rose-700 flex items-center gap-1"
                    >
                        {value}
                        <button
                            type="button"
                            onClick={() => onRemove(facet, value)}
                            className="ml-1 hover:text-rose-900 cursor-pointer"
                            aria-label={`Remove filter ${facet}: ${value}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))
            )}

            {/* Clear All (only appears if query refinements exist) */}
            {Object.keys(refinements).length > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-gray-600 hover:text-rose-700 cursor-pointer"
                    onClick={onClearAll}
                >
                    Clear All
                </Button>
            )}
        </div>
    );
}
