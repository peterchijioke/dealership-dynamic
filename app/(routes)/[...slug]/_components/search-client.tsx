'use client';

import { SearchBox, Hits, Highlight } from 'react-instantsearch';
import VehicleCard from './vehicle-card';
import type { Vehicle } from '@/types/vehicle';

function Hit({ hit }: { hit: Vehicle }) {
    return (<VehicleCard hit={hit} />);
}

export function SearchClient() {
    return (
        <>
            <SearchBox classNames={{ root: 'w-full' }} />
            <Hits
                hitComponent={Hit}
                classNames={{
                    list: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3",
                    item: "flex",
                }}
            />
        </>
    );
}
