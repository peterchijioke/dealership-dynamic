"use client";

import { useState, useMemo, FC } from "react";
import {
  useRefinementList,
  useToggleRefinement,
  useInstantSearch,
  useRange,
} from "react-instantsearch";

// Attributes that are not searchable
const nonSearchableAttributes = new Set(["price", "mileage", "year", "doors"]);

interface FacetSectionProps {
  attribute: string;
  label: string;
  type: "list" | "toggle" | "range";
}

// ---------------- Toggle ----------------
type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  activeColor?: string;
};

export const Toggle: FC<ToggleProps> = ({
  checked,
  onChange,
  ariaLabel,
  activeColor = "bg-green-500",
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel || "Toggle"}
    onClick={() => onChange(!checked)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(!checked);
      }
    }}
    className={`relative inline-flex h-7 w-14 items-center rounded-full 
      transition-colors duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 
      ${checked ? activeColor : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md 
        transition-transform duration-300 ease-out
        ${checked ? "translate-x-7" : "translate-x-1"}`}
    />
  </button>
);

// --------------- Helper -----------------
function formatRangeValue(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toString()
    : "";
}

// --------------- Custom Range Input (No button) -----------------
const CustomRangeInput = ({ attribute }: { attribute: string }) => {
  const { range, start, refine } = useRange({ attribute });

  const [localState, setLocalState] = useState({
    min: formatRangeValue(start?.[0]),
    max: formatRangeValue(start?.[1]),
  });

  const handleChange = (field: "min" | "max", val: string) => {
    setLocalState((prev) => ({ ...prev, [field]: val }));

    const min =
      field === "min"
        ? val
          ? parseFloat(val)
          : undefined
        : localState.min
        ? parseFloat(localState.min)
        : undefined;

    const max =
      field === "max"
        ? val
          ? parseFloat(val)
          : undefined
        : localState.max
        ? parseFloat(localState.max)
        : undefined;

    refine([min, max]);
  };

  const isRangeValid =
    Number.isFinite(range?.min) && Number.isFinite(range?.max);

  if (!isRangeValid) {
    return (
      <div className="text-sm text-neutral-400 px-3 py-2">
        Range not available
      </div>
    );
  }

  return (
    <div className="mt-3 flex gap-3">
      <div className="flex flex-col flex-1">
        <label className="mb-1 text-xs text-neutral-500">Min</label>
        <input
          type="number"
          className="w-full rounded-md border px-2 py-2 text-base"
          placeholder={formatRangeValue(range.min)}
          value={localState.min}
          onChange={(e) => handleChange("min", e.target.value)}
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="mb-1 text-xs text-neutral-500">Max</label>
        <input
          type="number"
          className="w-full rounded-md border px-2 py-2 text-base"
          placeholder={formatRangeValue(range.max)}
          value={localState.max}
          onChange={(e) => handleChange("max", e.target.value)}
        />
      </div>
    </div>
  );
};

// ---------------- FacetSection ----------------
export default function FacetSection({
  attribute,
  label,
  type,
}: FacetSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const isSearchable = !nonSearchableAttributes.has(attribute);

  const { results } = useInstantSearch();

  // Always call hooks
  const refinementList = useRefinementList({ attribute });
  const toggle = useToggleRefinement({ attribute });
  const { items: makeItems } = useRefinementList({ attribute: "make" });

  const { items, refine, searchForItems } = refinementList;

  const refinedCount = useMemo(
    () => items?.filter((item) => item.isRefined).length || 0,
    [items]
  );

  const isMakeSelected = useMemo(
    () => makeItems?.some((item) => item.isRefined) || false,
    [makeItems]
  );

  // Conditional rendering logic
  if (!isMakeSelected && (attribute === "model" || attribute === "trim")) {
    return null;
  }

  if (type === "toggle") {
    if (!toggle?.value) {
      return null;
    }
    return (
      <div className="mb-3 flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-3">
        <span className="text-lg font-medium">{label ?? attribute}</span>
        <Toggle
          checked={toggle.value.isRefined}
          onChange={() => toggle.refine(toggle.value)}
        />
      </div>
    );
  }

  if (type === "range") {
    return (
      <details className="border-b border-neutral-200 py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
          <span className="text-[18px]">{label ?? attribute}</span>
          <span className="text-neutral-500">▾</span>
        </summary>
        <CustomRangeInput attribute={attribute} />
      </details>
    );
  }

  if (!items?.length) {
    return null;
  }

  const filteredItems =
    searchInput && isSearchable
      ? items.filter((item) =>
          item.label.toLowerCase().includes(searchInput.toLowerCase())
        )
      : items;

  return (
    <details
      className="border-b border-neutral-200 py-4"
      open={attribute === "condition"}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
        <span className="flex items-center gap-3">
          <span className="text-[18px]">{label ?? attribute}</span>
        </span>
        <span className="flex items-center gap-3">
          {refinedCount > 0 && (
            <span className="grid h-7 w-7 place-items-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
              {refinedCount}
            </span>
          )}
          <span className="text-neutral-500">▾</span>
        </span>
      </summary>

      <div className="mt-3 space-y-3 text-sm">
        {isSearchable && items.length > 5 && (
          <div className="mb-3">
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder={`Search ${label?.toLowerCase() || attribute}...`}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (searchForItems) {
                  searchForItems(e.target.value);
                }
              }}
            />
          </div>
        )}

        {filteredItems.slice(0, 10).map((item) => (
          <label
            key={item.value}
            className="flex items-center justify-between text-base cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              />
              <span>{item.label}</span>
            </div>
            <span className="text-sm text-neutral-500">({item.count})</span>
          </label>
        ))}

        {filteredItems.length > 10 && (
          <button
            className="text-sm text-neutral-600 hover:text-neutral-900"
            onClick={() => {
              console.log("Show more clicked for", attribute);
            }}
          >
            Show {filteredItems.length - 10} more...
          </button>
        )}
      </div>
    </details>
  );
}
