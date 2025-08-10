"use client";
import { Button } from "@/components/ui/button";
import { VehicleFilterConditionDisplay } from "./filter-condition-display";
import { useCallback, useRef, memo } from "react";
import { SortBy } from "react-instantsearch";
import { algoliaSortOptions } from "@/configs/config";
import { VehicleCount } from "./vehicle-count";
import AutoSearchComponent from "./AutoSearchComponent";

export const SearchInventory = memo(function SearchInventory() {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSort = useCallback(() => {
    if (searchContainerRef.current && inputRef.current) {
      const containerRect = searchContainerRef.current.getBoundingClientRect();
      requestAnimationFrame(() => {
        if (searchContainerRef.current) {
          searchContainerRef.current.style.height = `${containerRect.height}px`;
        }
      });
    }
  }, []);

  return (
    <>
      <div className="w-full flex-col flex">
        <div
          ref={searchContainerRef}
          className="flex flex-col md:flex-row gap-5 md:gap-2 w-full items-stretch md:items-center px-2 sm:px-3 lg:px-4 min-h-10 relative z-[80]"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <div className=" flex flex-row items-center flex-1 gap-5">
            <VehicleCount />
            <div className=" flex-1">
              <AutoSearchComponent />
            </div>
          </div>

          <Button
            className="w-full  md:w-fit h-full capitalize focus-visible:ring-0 cursor-pointer bg-rose-700 hover:bg-rose-700 flex-shrink-0"
            onClick={handleSort}
            style={{ transform: "translate3d(0,0,0)" }}
          >
            <SortBy items={algoliaSortOptions} />
          </Button>
        </div>

        <VehicleFilterConditionDisplay />
      </div>
    </>
  );
});
