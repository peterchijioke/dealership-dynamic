"use client";

import { InfiniteHits } from "react-instantsearch";
import { VehicleCard } from "./VehicleCard";
import { createInfiniteHitsSessionStorageCache } from "instantsearch.js/es/lib/infiniteHitsCache";
import classNames from "classnames";
import styles from "./VehicleGrid.module.css";

const sessionStorageCache = createInfiniteHitsSessionStorageCache();

export default function VehicleGrid() {
  return (
    <div
      className="vehicle-grid vehicle-grid--container py-1"
      style={{ ["--card-max" as any]: "420px" }} // optional cap
    >
      <InfiniteHits
        hitComponent={VehicleCard}
        cache={sessionStorageCache}
        showPrevious={false}
        classNames={{
          root: "w-full",
          list: classNames(
            "vehicle-grid vehicle-grid--container w-full gap-4 px-4 py-1 lg:gap-2 xl:py-4 2xl:gap-4",
            styles.VehicleGrid
          ),
          item: "block", // let grid handle placement; no flex here
          loadMore: "col-span-full flex justify-center mt-4",
          disabledLoadMore: "col-span-full flex mt-4 opacity-50",
        }}
      />
    </div>
  );
}
