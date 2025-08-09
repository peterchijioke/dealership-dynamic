"use client";

import { Search, X, Loader } from "lucide-react";
import { useSearchBox } from "react-instantsearch";

const AutoSearchComponent: React.FC = () => {
  const {
    query,
    refine,
    clear,
    isSearchStalled: isStalled, // whether Algolia is loading
  } = useSearchBox();

  return (
    <div className="flex-1">
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg focus-within:ring-2">
          <Search className="ml-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Inventory"
            value={query}
            onChange={(e) => refine(e.target.value)}
            className="flex-1 text-sm px-3 py-3 focus:ring-0 focus-visible:ring-0 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
          />
          {query && (
            <button
              disabled={isStalled}
              onClick={() => clear()}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isStalled ? (
                <Loader className="text-rose-700 animate-spin size-4" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoSearchComponent;
