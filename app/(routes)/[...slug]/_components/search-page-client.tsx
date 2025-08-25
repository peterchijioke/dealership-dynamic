'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { Configure } from 'react-instantsearch';
import { SearchClient } from './search-client';
import { searchClient } from '@/configs/config';

export default function SearchPageClient({
    indexName,
    query,
}: {
    indexName: string;
    query: string;
}) {
    return (
        <InstantSearchNext
            indexName={indexName}
            searchClient={searchClient}
            initialUiState={{ [indexName]: { query } }}
        >
            <Configure query={query} />
            <div className="flex-1 relative flex flex-col lg:flex-row">
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    {/* <SidebarFilters /> */}
                </aside>
                <main className="flex-1 space-y-2 bg-gray-100 p-4 mt-28">
                    <SearchClient />
                </main>
            </div>
        </InstantSearchNext>
    );
}
