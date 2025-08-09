"use client";

import { useState } from "react";

export default function FiltersSidebar() {
  const [showSpecial, setShowSpecial] = useState(true);

  const Section = ({
    title,
    children,
    defaultOpen = false,
    count,
  }: {
    title: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
    count?: number;
  }) => (
    <details className="border-b border-neutral-200 py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
        <span className="flex items-center gap-3">
          <span className="text-[18px]">{title}</span>
        </span>
        <span className="flex items-center gap-3">
          {typeof count === "number" && count > 0 && (
            <span className="grid h-7 w-7 place-items-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
              {count}
            </span>
          )}
          <span className="text-neutral-500">▾</span>
        </span>
      </summary>
      {children && <div className="mt-3 space-y-3 text-sm">{children}</div>}
    </details>
  );

  return (
    <div className="border border-neutral-200 bg-white p-4 ">
      <div className="px-2 pb-4">
        <div className="text-center text-2xl font-extrabold tracking-wide">
          SELECT FILTERS
        </div>
        <div className="mx-auto mt-2 h-[2px] w-11/12 bg-neutral-900/80" />
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-3">
        <span className="text-lg">Show Special</span>
        <button
          onClick={() => setShowSpecial((v) => !v)}
          className={`relative h-8 w-16 rounded-full border transition ${
            showSpecial
              ? "bg-black border-black"
              : "bg-white border-neutral-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-7 w-7 rounded-full bg-white shadow transition ${
              showSpecial ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <Section title="Condition" defaultOpen count={2}>
        <label className="flex items-center gap-2 text-base">
          <input type="checkbox" className="size-4" defaultChecked /> New
        </label>
        <label className="flex items-center gap-2 text-base">
          <input type="checkbox" className="size-4" defaultChecked /> Used
        </label>
        <label className="flex items-center gap-2 text-base">
          <input type="checkbox" className="size-4" /> Certified
        </label>
      </Section>

      <Section title="Price">
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Min"
          />
          <span className="text-neutral-400">—</span>
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Max"
          />
        </div>
      </Section>

      {/* Skeleton sections */}
      <Section title="Year" />
      <Section title="Make" />
      <Section title="Model & Trim" />
      <Section title="Body style" />
      <Section title="Fuel type" />
      <Section title="Exterior color" />
      <Section title="Interior color" />
      <Section title="Drive train" />
      <Section title="Transmission" />
      <Section title="Engine" />
      <Section title="Doors" />
      <Section title="Key features" />
      <Section title="Mileage" />
    </div>
  );
}
