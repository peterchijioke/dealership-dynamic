"use client";

import {
  createInstantSearchNextInstance,
  InstantSearchNext,
} from "react-instantsearch-nextjs";
import {
  SearchBox,
  Configure,
  CurrentRefinements,
  ClearRefinements,
} from "react-instantsearch";
import { searchClient } from "@/configs/config";
import SidebarFilters from "./sidebar-filters";
import InfiniteHits from "./infinite-hits";
import { routing } from "@/lib/algolia/custom-routing";
import { refinementToFacetFilters } from "@/lib/algolia";
import CarouselBanner from "@/components/inventory/CarouselBanner";
const searchInstance = createInstantSearchNextInstance();

export default function SearchClient({
  indexName,
  query,
  serverHits,
  serverFacets,
  initialUiState,
}: {
  indexName: string;
  query: string;
  serverHits: any[];
  serverFacets: any;
  initialUiState: any;
}) {
  // Derive facetFilters again on the client from the refinements in uiState
  const refinementList = initialUiState?.[indexName]?.refinementList || {};
  const facetFilters = refinementToFacetFilters(refinementList);

  return (
    <InstantSearchNext
      instance={searchInstance}
      indexName={indexName}
      searchClient={searchClient}
      ignoreMultipleHooksWarning={true}
      future={{
        preserveSharedStateOnUnmount: true,
        persistHierarchicalRootCount: true,
      }}
      // initialUiState={initialUiState}
      routing={routing}
    >
      <Configure
        query={query}
        hitsPerPage={12}
        facetFilters={facetFilters}
        // facets={FACETS}
        // attributesToRetrieve={ATTRUBUTES_TO_RETRIEVE}
      />
      <div className="mt-28 py-1">
        <CarouselBanner />
      </div>
      <div className="flex-1 relative flex flex-col lg:flex-row px-4">
        <SearchBox classNames={{ root: "w-fullx" }} />
        <div className="flex gap-2 items-center py-2">
          <CurrentRefinements
            classNames={{
              root: "flex gap-2",
              list: "flex gap-2",
              item: "bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center",
              label: "font-medium mr-1",
              category: "flex items-center",
              delete: "ml-2 text-red-500 hover:text-red-700 cursor-pointer",
            }}
          />
          <ClearRefinements
            translations={{ resetButtonText: "Clear all" }}
            classNames={{
              button:
                "text-sm text-blue-600 underline hover:text-blue-800 disabled:text-gray-400",
            }}
          />
        </div>
      </div>
      <div className="flex-1 relative flex flex-col lg:flex-row">
        <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="font-bold text-center uppercase">Search Filters</h2>
          <SidebarFilters serverFacets={serverFacets} />
        </aside>
        <main className="flex-1 space-y-2 bg-gray-100 p-4">
          <InfiniteHits serverHits={serverHits} />
        </main>
      </div>
    </InstantSearchNext>
  );
}
