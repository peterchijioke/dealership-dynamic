'use client';

import { createInstantSearchNextInstance, InstantSearchNext } from 'react-instantsearch-nextjs';
import { SearchBox, Configure } from 'react-instantsearch';
import { searchClient } from '@/configs/config';
import SidebarFilters from './sidebar-filters';
import InfiniteHits from './infinite-hits';
import { routing } from '@/lib/algolia/custom-routing';
import { refinementToUrl } from '@/lib/url-formatter';

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
    return (
        <InstantSearchNext
            instance={searchInstance}
            indexName={indexName}
            searchClient={searchClient}
            // initialUiState={initialUiState || { [indexName]: { query } }}
            future={{
                preserveSharedStateOnUnmount: true,
                persistHierarchicalRootCount: true,
            }}
            // onStateChange={({ uiState, setUiState }) => {
            //     const indexUiState = uiState[indexName] || {};
            //     const filters = indexUiState.refinementList || {};

            //     const url = refinementToUrl(filters);
            //     setUiState(uiState);

            //     if (typeof window !== "undefined") {
            //         window.history.pushState({}, "", url);
            //     }
            // }}
            routing={routing}
        >
            <Configure query={query} />
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

