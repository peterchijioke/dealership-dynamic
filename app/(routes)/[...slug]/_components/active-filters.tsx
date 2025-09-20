"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderFacets } from "@/lib/helpers";

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

  const orderedFacets = orderFacets(refinements);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Clear All (only appears if query refinements exist) */}
      {Object.keys(orderedFacets).length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-base text-white rounded-full bg-rose-700  cursor-pointer"
          onClick={onClearAll}
        >
          Reset
        </Button>
      )}

      {Object.entries(orderedFacets).map(([facet, values]) =>
        values.map((value) => (
          <span
            key={`${facet}-${value}`}
            className="px-3 py-1 text-base rounded-full bg-[#E5E4E1] text-black flex items-center gap-1"
          >
            {facet === "is_special" ? "Special" : value}
            <button
              type="button"
              onClick={() => onRemove(facet, value)}
              className="ml-1 text-black cursor-pointer"
              aria-label={`Remove filter ${facet}: ${value}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))
      )}
    </div>
  );
}
