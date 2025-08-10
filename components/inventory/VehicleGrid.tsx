"use client";

import { InfiniteHits, useInstantSearch } from "react-instantsearch";
import { VehicleCard } from "./VehicleCard";
import { createInfiniteHitsSessionStorageCache } from "instantsearch.js/es/lib/infiniteHitsCache";
import classNames from "classnames";
import styles from "./VehicleGrid.module.css";
import VehicleCardSkeleton from "./VehicleCardSkeleton";

const sessionStorageCache = createInfiniteHitsSessionStorageCache();

export default function VehicleGrid() {
  const { status } = useInstantSearch();
  return (
    <div
      className="vehicle-grid vehicle-grid--container "
      style={{ ["--card-max" as any]: "420px" }}
    >
      {(status === "loading" || status === "stalled") && (
        <div
          className={
            styles.VehicleGrid +
            " w-full gap-4 px-4 py-1 lg:gap-2 xl:py-4 2xl:gap-4"
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      )}
      <InfiniteHits
        hitComponent={(props) => (
          // Mark the very first hit on the first page as high priority to improve LCP
          <VehicleCard
            {...props}
            isLcpCandidate={props.hit?.__position === 1}
          />
        )}
        cache={sessionStorageCache}
        showPrevious={false}
        classNames={{
          root: "w-full",
          list: classNames(
            "vehicle-grid vehicle-grid--container w-full gap-4 px-4 py-1 lg:gap-2 xl:py-4 2xl:gap-4",
            styles.VehicleGrid
          ),
          item: "block",
          loadMore: "col-span-full flex justify-center mt-4",
          disabledLoadMore: "col-span-full flex mt-4 opacity-50",
        }}
      />
    </div>
  );
}
