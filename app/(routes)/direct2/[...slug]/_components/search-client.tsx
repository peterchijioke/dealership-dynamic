"use client";
import { usePathname } from "next/navigation";
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
// import CarouselBanner from '@/components/inventory/CarouselBanner';
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
    const pathname = usePathname();

  // Derive facetFilters again on the client from the refinements in uiState
  const refinementList = initialUiState?.[indexName]?.refinementList || {};
  const facetFilters = refinementToFacetFilters(refinementList);

  return (
    <InstantSearchNext
      key={`is-${pathname}`}
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
      <Configure query={query} hitsPerPage={12} facetFilters={facetFilters} />
      <div className="mt-28 py-1">{/* <CarouselBanner /> */}</div>
      <div className="flex-1 relative flex flex-col lg:flex-row lg:justify-between px-4">
        <SearchBox
          placeholder="Search vehicles..."
          classNames={{
            root: "w-full max-w-md",
            form: "flex items-center w-full rounded-2xl border border-gray-300 bg-white shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500",
            input:
              "flex-1 border-none outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm",
            submit:
              "mr-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer",
            reset:
              "ml-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer",
            loadingIndicator: "ml-2 text-gray-400 animate-spin",
          }}
        />
        <div className="flex gap-2 items-center py-2">
          <CurrentRefinements
            classNames={{
              root: "flex gap-2 flex-wrap",
              list: "flex gap-2 flex-wrap",
              item: "bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center",
              label: "hidden",
              category: "flex items-center",
              categoryLabel: "mr-1",
              delete: "ml-2 text-red-500 hover:text-red-700 cursor-pointer",
            }}
            transformItems={(items) =>
              items.flatMap((item) =>
                item.refinements.map((refinement) => ({
                  ...item,
                  refinements: [
                    {
                      ...refinement,
                      label: String(refinement.value),
                    },
                  ],
                  label: String(refinement.value),
                  attribute: item.attribute,
                  key: `${item.attribute}-${refinement.value}`,
                }))
              )
            }
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
