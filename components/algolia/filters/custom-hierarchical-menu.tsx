"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type HierarchyNode = {
    name: string;
    count: number;
    children?: HierarchyNode[];
};

type Props = {
    attribute1: string; // e.g. "model"
    attribute2: string; // e.g. "trim"
    values: HierarchyNode[]; // from buildModelTrimHierarchy()
    selectedFacets: Record<string, string[]>;
    updateFacet: (attribute: string, value: string) => void;
    className?: string;
};

export default function CustomHierarchicalMenu({
    attribute1,
    attribute2,
    values,
    selectedFacets,
    updateFacet,
    className,
}: Props) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const selectedModels = selectedFacets[attribute1] || [];
    const selectedTrims = selectedFacets[attribute2] || [];

    const toggleExpand = (model: string, checked: boolean) => {
        setExpanded((prev) => ({
            ...prev,
            [model]: checked ? true : false, // expand on check, collapse on uncheck
        }));
    };

    return (
        <div className={cn("w-full", className)}>
            <ul className="space-y-2">
                {values.map((node) => {
                    const isChecked = selectedModels.includes(node.name);
                    const isExpanded = expanded[node.name] || isChecked;

                    return (
                        <li key={node.name}>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                            updateFacet(attribute1, node.name);
                                            toggleExpand(node.name, !isChecked);
                                        }}
                                        className="h-4 w-4 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium">{node.name}</span>
                                </label>

                                <span className="text-xs text-gray-500">{node.count}</span>
                            </div>

                            {/* Show children when expanded */}
                            {node.children && isExpanded && (
                                <ul className="ml-6 mt-1 space-y-1">
                                    {node.children.map((child) => {
                                        const childKey = node.name + "+" + child.name;
                                        const isChildChecked = selectedTrims.includes(childKey);

                                        return (
                                            <li key={childKey}>
                                                <label className="flex items-center justify-between gap-2 cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChildChecked}
                                                            onChange={() => updateFacet(attribute2, childKey)}
                                                            className="h-4 w-4 cursor-pointer"
                                                        />
                                                        <span className="text-sm">{child.name}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{child.count}</span>
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
