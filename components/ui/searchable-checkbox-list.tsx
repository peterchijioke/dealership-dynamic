"use client";

import { useState, useMemo } from "react";

type Item = {
    label: string;
    count: number;
};

interface Props {
    items: Item[];
    searchable?: boolean;
}

export default function SearchableCheckboxList({ items, searchable }: Props) {
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    // Filter by search
    const filtered = useMemo(() => {
        return items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    // Show first 10 or all
    const visibleItems = showAll ? filtered : filtered.slice(0, 10);

    const toggleSelection = (label: string) => {
        setSelected((prev) =>
            prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
        );
    };

    return (
        <div>
            {/* Search box */}
            {searchable && items.length > 5 && (
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                    />
                </div>
            )}

            {/* List */}
            <ul className="space-y-2 max-h-80 overflow-y-auto">
                {visibleItems.map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selected.includes(item.label)}
                                onChange={() => toggleSelection(item.label)}
                            />
                            <span className="text-sm">{item.label}</span>
                        </label>
                        <span className="text-gray-500 text-sm">{item.count}</span>
                    </li>
                ))}
            </ul>

            {/* Show more/less */}
            {filtered.length > 10 && (
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
