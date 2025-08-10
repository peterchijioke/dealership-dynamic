"use client";

import React from "react";

// A lightweight skeleton loader that mirrors the VehicleCard layout
export function VehicleCardSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col rounded-xl bg-white text-card-foreground shadow border border-gray-100 animate-pulse">
      {/* Top tag strip */}
      <div className="absolute left-0 right-0 top-0 z-10 flex justify-center">
        <div className="h-7 w-40 rounded-t-2xl bg-gray-200" />
      </div>

      {/* Media */}
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-[3/2] w-full bg-gray-200" />
      </div>

      {/* Body */}
      <div className="px-3 py-5 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-center mb-1">
          <div className="flex items-center space-x-2 flex-1">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded-full" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />

        {/* Pricing rows */}
        <div className="space-y-3 mb-3">
          <div className="flex justify-between">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Sale price */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>

        <div className="border-t border-gray-200 my-3" />

        {/* OEM incentives block (collapsed) */}
        <div className="bg-gray-100 rounded-lg py-2 px-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-5 w-5 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Carfax + mileage */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="h-10 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        {/* CTAs */}
        <div className="mt-auto flex gap-2">
          <div className="h-10 flex-1 bg-gray-200 rounded" />
          <div className="h-10 flex-1 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default VehicleCardSkeleton;
