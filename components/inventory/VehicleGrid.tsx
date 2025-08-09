"use client";

import { InfiniteHits } from "react-instantsearch";
import { VehicleCard } from "./VehicleCard";
import { createInfiniteHitsSessionStorageCache } from "instantsearch.js/es/lib/infiniteHitsCache";

const sessionStorageCache = createInfiniteHitsSessionStorageCache();

export default function VehicleGrid() {
  return (
    <div className="vehicle-grid vehicle-grid--container py-1">
      <InfiniteHits
        hitComponent={VehicleCard}
        cache={sessionStorageCache}
        showPrevious={false}
        classNames={{
          root: "w-full",
          // Make the OL a responsive auto-fitting grid
          list:
            "grid w-full gap-3 sm:gap-4 lg:gap-6 " +
            "[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]",
          // Each LI is a grid item
          item: "w-full h-full list-none",
          loadMore: "col-span-full flex justify-center mt-4",
          disabledLoadMore: "col-span-full flex justify-center mt-4 opacity-50",
        }}
      />
    </div>
  );
}
