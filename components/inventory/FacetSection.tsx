"use client";
import { useState, useMemo, FC } from "react";
import {
  useRefinementList,
  useToggleRefinement,
  useInstantSearch,
  useRange,
} from "react-instantsearch";

const nonSearchableAttributes = new Set(["price", "mileage", "year", "doors"]);

interface FacetSectionProps {
  attribute: string;
  label: string;
  type: "list" | "toggle" | "range";
}

// ---------------- Compact Black/Gray Toggle ----------------
type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
};

export const Toggle: FC<ToggleProps> = ({ checked, onChange, ariaLabel }) => (
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
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      checked ? "bg-black" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
        checked ? "translate-x-4" : "translate-x-0.5"
      }`}
    />
  </button>
);

// ---------------- Helper ----------------
function formatRangeValue(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toString()
    : "";
}

// ---------------- Custom Range Input ----------------
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
    <div className="mt-4 flex gap-3">
      <div className="flex flex-col flex-1">
        <label className="mb-1 text-xs text-neutral-500 font-medium">Min</label>
        <input
          type="number"
          className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm focus:border-black focus:ring-black transition"
          placeholder={formatRangeValue(range.min)}
          value={localState.min}
          onChange={(e) => handleChange("min", e.target.value)}
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="mb-1 text-xs text-neutral-500 font-medium">Max</label>
        <input
          type="number"
          className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm focus:border-black focus:ring-black transition"
          placeholder={formatRangeValue(range.max)}
          value={localState.max}
          onChange={(e) => handleChange("max", e.target.value)}
        />
      </div>
    </div>
  );
};

// ---------------- FacetSection Component ----------------
export default function FacetSection({
  attribute,
  label,
  type,
}: FacetSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const isSearchable = !nonSearchableAttributes.has(attribute);

  const { results } = useInstantSearch();

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

  // Hide model/trim if no make is selected
  if (!isMakeSelected && (attribute === "model" || attribute === "trim")) {
    return null;
  }

  // Toggle type
  if (type === "toggle") {
    if (!toggle?.value) return null;
    return (
      <div className="mb-3 flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
        <span className="text-sm font-semibold text-neutral-900">
          {label ?? attribute}
        </span>
        <Toggle
          checked={toggle.value.isRefined}
          onChange={() => toggle.refine(toggle.value)}
          ariaLabel={label ?? attribute}
        />
      </div>
    );
  }

  // Range type
  if (type === "range") {
    return (
      <details className="border-b border-neutral-200 py-4" open>
        <summary className="flex cursor-pointer list-none items-center justify-between select-none text-sm font-semibold text-neutral-900">
          <span className="text-sm">{label ?? attribute}</span>
          <span className="text-neutral-500 text-lg details-marker">▾</span>
        </summary>
        <CustomRangeInput attribute={attribute} />
        <style jsx>{`
          .details-marker {
            transition: transform 0.2s ease;
          }
          details[open] .details-marker {
            transform: rotate(180deg);
          }
        `}</style>
      </details>
    );
  }

  if (!items?.length) {
    return null;
  }

  // Filter/search logic
  const filteredItems =
    searchInput && isSearchable
      ? items.filter((item) =>
          item.label.toLowerCase().includes(searchInput.toLowerCase())
        )
      : items;

  return (
    <details
      className="border-b border-neutral-200 py-3"
      open={attribute === "condition"}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between select-none text-sm font-semibold text-neutral-900">
        <span className="flex items-center gap-3">
          <span className="text-sm">{label ?? attribute}</span>
        </span>
        <span className="flex items-center gap-3">
          {refinedCount > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-black text-xs font-bold text-white">
              {refinedCount}
            </span>
          )}
          <span className="text-neutral-500 text-lg details-marker">▾</span>
        </span>
      </summary>

      <div className="mt-4 space-y-1 text-sm">
        {isSearchable && items.length > 5 && (
          <div className="mb-2">
            <input
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:ring-black transition"
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
            className="flex items-center justify-between cursor-pointer rounded-md px-2 py-1 transition hover:bg-neutral-100 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 accent-black border-neutral-400 rounded transition"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              />
              <span>{item.label}</span>
            </div>
            <span className="text-xs text-neutral-500">({item.count})</span>
          </label>
        ))}

        {filteredItems.length > 10 && (
          <button
            className="text-xs font-semibold text-neutral-600 hover:text-black transition"
            onClick={() => {
              console.log("Show more clicked for", attribute);
            }}
          >
            Show {filteredItems.length - 10} more...
          </button>
        )}
      </div>
      <style jsx>{`
        .details-marker {
          transition: transform 0.2s ease;
        }
        details[open] .details-marker {
          transform: rotate(180deg);
        }
      `}</style>
    </details>
  );
}
