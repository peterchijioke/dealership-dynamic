import React, { useEffect, useRef } from "react";
import { Hits, Highlight, useSearchBox } from "react-instantsearch";
import Link from "next/link";
import { Search } from "lucide-react";

export function CustomSearchBox({ setSearchOpen }: { setSearchOpen: (open: boolean) => void }) {
    const { query, refine } = useSearchBox();

    return (
        <div className="relative w-full flex-1">
            <div className="rounded-full flex-row flex items-center flex-1 bg-[#E4E6E8]">
                <Search className="w-4 h-4 ml-2 my-2 text-gray-600" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => refine(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    className="w-full flex-1 bg-transparent placeholder:text-gray-600 focus:outline-none px-2 py-2"
                    placeholder="Search here"
                />
            </div>
        </div>
    );
}

export default function SearchDropdown({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { query } = useSearchBox(); // 👈 get current query
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Only show when open AND query is not empty
    if (!isOpen || query.trim().length === 0) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none" />

            {/* Dropdown */}
            <div
                ref={ref}
                className="absolute top-full mt-2 w-full max-w-2xl bg-white border rounded-xl shadow-lg z-50"
            >
                <div className="max-h-80 overflow-y-auto">
                    <Hits hitComponent={Hit} />
                </div>
            </div>
        </>
    );
}

function Hit({ hit }: any) {
    return (
        <Link
            href={`/vehicle/${hit.objectID}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b"
        >
            {hit.photo && (
                <img
                    src={hit.photo}
                    alt={hit.title}
                    className="w-16 h-12 object-cover rounded"
                />
            )}
            <div>
                <p className="font-medium">
                    <Highlight attribute="title" hit={hit} />
                </p>
                <p className="text-sm text-gray-500">${hit.price}</p>
            </div>
        </Link>
    );
}
