'use client';

import { createInstantSearchNextInstance, InstantSearchNext } from 'react-instantsearch-nextjs';
import { SearchBox, Configure, RefinementList } from 'react-instantsearch';
import { ATTRUBUTES_TO_RETRIEVE, FACETS, searchClient } from '@/configs/config';
import SidebarFilters from './sidebar-filters';
import InfiniteHits from './infinite-hits';
import { routing } from '@/lib/algolia/custom-routing';
import { refinementToFacetFilters } from '@/lib/algolia';

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

    const searchInstance = createInstantSearchNextInstance();

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
            <div className="flex-1 relative flex flex-col lg:flex-row">
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    <SidebarFilters serverFacets={serverFacets} />
                </aside>
                <main className="flex-1 space-y-2 bg-gray-100 p-4 mt-28">
                    <SearchBox classNames={{ root: 'w-full' }} />
                    {/* <HydratableHits serverHits={serverHits} /> */}
                    <InfiniteHits serverHits={serverHits} />
                </main>
            </div>
        </InstantSearchNext>
    );
}

