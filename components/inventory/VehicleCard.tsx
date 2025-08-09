"use client";

import { Heart, ShieldCheck } from "lucide-react";
import PriceBlock from "./PriceBlock";
import Badge from "./Badge";
import { Vehicle } from "@/types/vehicle";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const {
    image,
    year,
    make,
    model,
    trim,
    condition,
    salePrice,
    retailPrice,
    discount,
    miles,
    badges = [],
  } = vehicle;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={image}
          alt={`${year} ${make} ${model}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/90 p-2 shadow"
          aria-label="Favorite"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
          {condition?.toLowerCase() === "certified" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium">
              <ShieldCheck className="h-4 w-4" />
              CERTIFIED Pre‑Owned
            </span>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="text-sm text-neutral-500">
            Sedan {trim?.includes("AWD") ? "AWD" : "FWD"}
          </div>
          <h3 className="line-clamp-1 text-base font-semibold">
            {year} {make} {model} {trim ? ` ${trim}` : ""}
          </h3>
        </div>

        {/* Pricing */}
        <PriceBlock
          retailPrice={retailPrice}
          discount={discount}
          salePrice={salePrice}
          miles={miles}
        />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
            Confirm Availability
          </button>
          <button className="inline-flex w-full items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-neutral-50">
            Estimate My Payments
          </button>
        </div>
      </div>
    </div>
  );
}
