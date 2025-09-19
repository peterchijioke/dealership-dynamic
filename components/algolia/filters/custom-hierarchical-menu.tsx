import React, { useState } from "react";

type HierarchyNode = {
    name: string;
    count: number;
    children?: HierarchyNode[];
};

type Props = {
    items: HierarchyNode[];
    selected?: { model?: string; trim?: string };
    onSelect: (selection: { model?: string; trim?: string }) => void;
};

export default function CustomHierarchicalMenu({ items, selected, onSelect }: Props) {
    const [expanded, setExpanded] = useState<string | null>(null);

    const toggleExpand = (name: string) => {
        setExpanded(expanded === name ? null : name);
    };

    return (
        <ul className="space-y-2">
            {items.map((item) => {
                const isExpanded = expanded === item.name;
                const isSelectedModel = selected?.model === item.name;

                return (
                    <li key={item.name}>
                        <div
                            className={`flex justify-between cursor-pointer p-2 rounded-lg ${isSelectedModel ? "bg-blue-100 font-bold" : "hover:bg-gray-100"
                                }`}
                            onClick={() => {
                                if (item.children) {
                                    toggleExpand(item.name);
                                }
                                onSelect({ model: item.name }); // always select model first
                            }}
                        >
                            <span>{item.name}</span>
                            <span className="text-gray-500">{item.count}</span>
                        </div>

                        {item.children && isExpanded && (
                            <ul className="ml-4 mt-1 space-y-1 border-l pl-3">
                                {item.children.map((child) => {
                                    const isSelectedTrim =
                                        selected?.model === item.name &&
                                        selected?.trim === child.name;

                                    return (
                                        <li
                                            key={child.name}
                                            className={`flex justify-between cursor-pointer p-2 rounded-md ${isSelectedTrim
                                                    ? "bg-blue-50 font-semibold"
                                                    : "hover:bg-gray-50"
                                                }`}
                                            onClick={() =>
                                                onSelect({ model: item.name, trim: child.name })
                                            }
                                        >
                                            <span>{child.name}</span>
                                            <span className="text-gray-500">{child.count}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
