"use client";

import { cn } from "@/lib/utils";
import { useAlgolia } from "@/hooks/useAlgolia";
import { useState } from "react";
import { updateFacetFilter } from "@/lib/algolia";

type HierarchicalFacet = Record<string, number>;

type Props = {
    attribute: string; // should be "hierarchicalCategories:model_trim"
    values: Record<string, HierarchicalFacet | number>;
    selectedFacets: Record<string, string[]>;
    updateFacet: (attribute: string, value: string) => void;
    className?: string;
};

/**
 * Custom hierarchical menu for Algolia hierarchical facet like:
 * hierarchicalCategories.model_trim: ["Camry > SE", "Camry > XLE", "Civic > LX"]
 */
export default function CustomHierarchicalMenu({
    attribute,
    values,
    selectedFacets,
    updateFacet,
    className,
}: Props) {
    const { stateToRoute } = useAlgolia();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const selected = selectedFacets[attribute] || [];

    function toggle(value: string) {
        updateFacet(attribute, value);
        const updated = updateFacetFilter(selectedFacets, attribute, value);
        stateToRoute(updated);
    }

    function toggleExpand(model: string) {
        setExpanded((prev) => ({ ...prev, [model]: !prev[model] }));
    }

    // Values come in flattened hierarchical format (e.g. "Camry > SE")
    const models: Record<string, { trims: { name: string; count: number }[]; count: number }> = {};

    Object.entries(values).forEach(([path, count]) => {
        const parts = path.split(" > ");
        const model = parts[0];
        const trim = parts[1];

        if (!models[model]) {
            models[model] = { trims: [], count: 0 };
        }

        if (trim) {
            models[model].trims.push({ name: path, count: count as number });
        }

        models[model].count += count as number;
    });

    return (
        <div className={cn("w-full", className)}>
            <ul className="space-y-1">
                {Object.entries(models).map(([model, data]) => {
                    const isExpanded = expanded[model] || false;
                    const modelSelected = selected.includes(model);

                    return (
                        <li key={model}>
                            {/* Model row */}
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-left w-full"
                                    onClick={() => toggleExpand(model)}
                                >
                                    <span className="font-medium">{model}</span>
                                    <span className="text-xs text-gray-500">{data.count}</span>
                                </button>
                                <input
                                    type="checkbox"
                                    checked={modelSelected}
                                    onChange={() => toggle(model)}
                                    className="h-4 w-4 ml-2"
                                />
                            </div>

                            {/* Trim list */}
                            {isExpanded && data.trims.length > 0 && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    {data.trims.map((trim) => {
                                        const trimSelected = selected.includes(trim.name);
                                        return (
                                            <li key={trim.name}>
                                                <label className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={trimSelected}
                                                            onChange={() => toggle(trim.name)}
                                                            className="h-4 w-4"
                                                        />
                                                        <span className="text-sm">{trim.name.split(" > ")[1]}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{trim.count}</span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
