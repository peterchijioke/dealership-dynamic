'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { Configure } from 'react-instantsearch';
import { SearchBox, Hits, Highlight } from 'react-instantsearch';
import VehicleCard from './vehicle-card';
import type { Vehicle, VehicleHit } from '@/types/vehicle';
import { searchClient } from '@/configs/config';

export default function SearchPageClient({
    indexName,
    query,
    serverHits,
}: {
    indexName: string;
    query: string;
    serverHits: any[];
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
                    <SearchBox classNames={{ root: 'w-full' }} />
                    {serverHits?.length > 0 && (
                        <div id="serverHits" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                            {serverHits.map((hit) => (
                                <Hit
                                    key={hit.objectID}
                                    hit={hit}
                                />
                            ))}
                        </div>
                    )}
                    <Hits
                        hitComponent={Hit}
                        classNames={{
                            list: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3",
                            item: "flex",
                        }}
                    />
                </main>
            </div>
        </InstantSearchNext>
    );
}

function Hit({ hit }: { hit: Vehicle }) {
    return (<VehicleCard hit={hit} />);
}
