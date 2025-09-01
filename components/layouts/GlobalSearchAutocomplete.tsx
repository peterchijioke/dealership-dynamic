"use client";

import React, { useEffect, useRef, useState } from "react";
import { autocomplete } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { X } from "lucide-react";
import { search } from "@/lib/algolia";

export default function GlobalSearchAutocomplete() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open || !containerRef.current) return;

        const ac = autocomplete<any>({
            container: containerRef.current,
            placeholder: "Search vehicles...",
            openOnFocus: true,
            detachedMediaQuery: "", // force detached mode always
            getSources({ query }) {
                return [
                    {
                        sourceId: "vehicles",
                        getItems() {
                            if (!query) return [];
                            return search({ query, hitsPerPage: 6 }).then(res => res.hits);
                        },
                        templates: {
                            item({ item }) {
                                return `
                  <a 
                    href="/vehicle/used-${item.year}-${item.make}-${item.model}-${item.trim || ""}-${item.city || ""}-${item.vin}/"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <img 
                      src="${item.photo || "https://placehold.co/80x60"}" 
                      alt="${item.year} ${item.make} ${item.model}" 
                      class="w-[80px] h-[60px] rounded-md object-cover"
                    />
                    <div class="flex flex-col">
                      <span class="font-semibold text-base">
                        ${item.year} ${item.make} ${item.model} ${item.trim || ""}
                      </span>
                      <span class="text-sm text-gray-500">${item.city || ""}</span>
                    </div>
                  </a>
                `;
                            }
                        }
                    }
                ];
            }
        });

        return () => {
            ac.destroy();
        };
    }, [open]);

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
            >
                🔍 Search
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white">
                    {/* Header with close */}
                    <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
                        <h2 className="font-semibold text-lg">Search Vehicles</h2>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close search"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Autocomplete container */}
                    <div className="p-4 flex-1 overflow-y-auto">
                        <div ref={containerRef} />
                    </div>
                </div>
            )}
        </>
    );
}
