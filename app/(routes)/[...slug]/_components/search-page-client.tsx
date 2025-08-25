'use client';

import { useEffect, useState } from 'react';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { SearchBox, Hits, Configure, useHits } from 'react-instantsearch';
import VehicleCard from './vehicle-card';
import type { Vehicle } from '@/types/vehicle';
import { searchClient } from '@/configs/config';
import SidebarFilters from './sidebar-filters';

export default function SearchPageClient({
    indexName,
    query,
    serverHits,
    serverFacets,
}: {
    indexName: string;
    query: string;
    serverHits: any[];
    serverFacets: any;
    }) {
    

    return (
        <InstantSearchNext
            indexName={indexName}
            searchClient={searchClient}
            initialUiState={{ [indexName]: { query } }}
            future={{
                preserveSharedStateOnUnmount: true,
                persistHierarchicalRootCount: true,
            }}
        >
            <Configure query={query} />
            <div className="flex-1 relative flex flex-col lg:flex-row">
                <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 pt-4 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="font-bold text-center uppercase">Search Filters</h2>
                    <SidebarFilters serverFacets={serverFacets} />
                </aside>
                <main className="flex-1 space-y-2 bg-gray-100 p-4 mt-28">
                    <SearchBox classNames={{ root: 'w-full' }} />
                    <HydratableHits serverHits={serverHits} />
                </main>
            </div>
        </InstantSearchNext>
    );
}

function Hit({ hit }: { hit: Vehicle }) {
    return (<VehicleCard hit={hit} />);
}

function HydratableHits({ serverHits }: { serverHits: any[] }) {
    const { hits } = useHits<any>();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const displayHits = hydrated ? hits : serverHits;

    return (
        <div id="serverHits" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            {displayHits.map((hit) => (
                <Hit key={hit.objectID} hit={hit} />
            ))}
        </div>
    );
}

