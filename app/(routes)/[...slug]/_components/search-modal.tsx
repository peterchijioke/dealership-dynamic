import React, { useState } from "react";
import { X } from "lucide-react";
import { searchClient, srpIndex } from "@/configs/config";
import { Hits, InstantSearch, SearchBox, Highlight } from "react-instantsearch";


export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center">
            <div className="bg-white w-full max-w-2xl mt-20 rounded-2xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h2 className="text-lg font-semibold">Search Vehicles</h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <InstantSearch indexName={srpIndex} searchClient={searchClient}>
                    <div className="p-4">
                        <SearchBox
                            // translations={{ placeholder: "Search vehicles..." }}
                            className="w-full border rounded-lg"
                        />
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        <Hits hitComponent={Hit} />
                    </div>
                </InstantSearch>
            </div>
        </div>
    );
}

function Hit({ hit }: any) {
    return (
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <p className="font-medium">
                <Highlight attribute="name" hit={hit} />
            </p>
            <p className="text-sm text-gray-500">${hit.price}</p>
        </div>
    );
}
