import { useState, FC, useCallback } from "react";
import {
  useRefinementList,
  useToggleRefinement,
  useRange,
} from "react-instantsearch";

const NON_SEARCHABLE_ATTRIBUTES = new Set([
  "price",
  "mileage",
  "year",
  "doors",
]);

interface FacetSectionProps {
  attribute: string;
  label: string;
  type: "list" | "toggle" | "range";
}

// Compact toggle component
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

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

// Helper function to format range values
function formatRangeValue(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toString()
    : "";
}

// Custom range input component
const CustomRangeInput: FC<{ attribute: string }> = ({ attribute }) => {
  const { range, start, refine } = useRange({ attribute });
  const [localState, setLocalState] = useState({
    min: formatRangeValue(start?.[0]),
    max: formatRangeValue(start?.[1]),
  });

  const handleChange = (field: "min" | "max", val: string) => {
    setLocalState((prev) => ({ ...prev, [field]: val }));

    const minValue =
      field === "min"
        ? val
          ? parseFloat(val)
          : undefined
        : localState.min
        ? parseFloat(localState.min)
        : undefined;

    const maxValue =
      field === "max"
        ? val
          ? parseFloat(val)
          : undefined
        : localState.max
        ? parseFloat(localState.max)
        : undefined;

    refine([minValue, maxValue]);
  };

  const isRangeValid =
    Number.isFinite(range?.min) && Number.isFinite(range?.max);

  if (!isRangeValid) {
    return (
      <div className="px-3 py-2 text-sm text-neutral-400">
        Range not available
      </div>
    );
  }

  return (
    <div className="mt-4 flex gap-3">
      <div className="flex flex-1 flex-col">
        <label className="mb-1 text-xs font-medium text-neutral-500">Min</label>
        <input
          type="number"
          className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm transition focus:border-black focus:ring-black"
          placeholder={formatRangeValue(range.min)}
          value={localState.min}
          onChange={(e) => handleChange("min", e.target.value)}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <label className="mb-1 text-xs font-medium text-neutral-500">Max</label>
        <input
          type="number"
          className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm transition focus:border-black focus:ring-black"
          placeholder={formatRangeValue(range.max)}
          value={localState.max}
          onChange={(e) => handleChange("max", e.target.value)}
        />
      </div>
    </div>
  );
};

// Main facet section component
export default function FacetSection({
  attribute,
  label,
  type,
}: FacetSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const isSearchable = !NON_SEARCHABLE_ATTRIBUTES.has(attribute);

  const refinementList = useRefinementList({
    attribute,
    sortBy: ["name:asc"],
    limit: 1000,
  });

  const toggle = useToggleRefinement({ attribute });

  const { items, refine, searchForItems } = refinementList;

  const refinedCount = items?.filter((item) => item.isRefined).length || 0;

  // Render toggle type
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

  // Render range type
  if (type === "range") {
    return (
      <details className="border-b border-neutral-200 py-4" open>
        <summary className="flex cursor-pointer list-none items-center justify-between select-none text-sm font-semibold text-neutral-900">
          <span className="text-sm">{label ?? attribute}</span>
          <span className="details-marker text-lg text-neutral-500">▾</span>
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

  // Filter items based on search input
  const filteredItems =
    searchInput && isSearchable
      ? items.filter((item) =>
          item.label.toLowerCase().includes(searchInput.toLowerCase())
        )
      : items;

  const displayLabel = label ?? attribute;

  // For the `condition` facet, normalize case so duplicate values (e.g., New/new) merge.
  const displayItems = (() => {
    if (attribute !== "condition") return filteredItems;

    type Group = { values: string[]; count: number; isRefined: boolean };
    const groups = new Map<string, Group>();

    for (const it of filteredItems) {
      const key = it.label.toLowerCase().trim();
      const g = groups.get(key) ?? { values: [], count: 0, isRefined: false };
      g.values.push(it.value);
      g.count += it.count;
      g.isRefined = g.isRefined || it.isRefined;
      groups.set(key, g);
    }

    const order = ["new", "used", "certified"] as const;
    const toTitle = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const arr = Array.from(groups.entries()).map(([key, g]) => ({
      // Use the normalized key as the stable id
      key,
      // Render label nicely cased
      label: toTitle(key),
      // Combined count
      count: g.count,
      // Combined refined state
      isRefined: g.isRefined,
      // All underlying values we must toggle together
      _values: g.values,
      // Keep a representative value for compatibility where needed
      value: key,
    }));

    arr.sort((a, b) => {
      const ia = order.indexOf(a.key as (typeof order)[number]);
      const ib = order.indexOf(b.key as (typeof order)[number]);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.label.localeCompare(b.label);
    });

    return arr;
  })();

  return (
    <details
      className="border-b border-neutral-200 py-3"
      open={attribute === "condition"}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between select-none text-sm font-semibold text-neutral-900">
        <span className="flex items-center gap-3">
          <span className="text-sm">{displayLabel}</span>
        </span>
        <span className="flex items-center gap-3">
          {refinedCount > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-black text-xs font-bold text-white">
              {refinedCount}
            </span>
          )}
          <span className="details-marker text-lg text-neutral-500">▾</span>
        </span>
      </summary>

      <div className="mt-4 space-y-1 text-sm">
        {/* Search input for searchable attributes with many items */}
        {isSearchable && items.length > 5 && (
          <div className="mb-2">
            <input
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition focus:border-black focus:ring-black"
              placeholder={`Search ${displayLabel.toLowerCase()}...`}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                searchForItems?.(e.target.value);
              }}
            />
          </div>
        )}

        {/* Render filtered items */}
        {displayItems.slice(0, 10).map((item: any) => (
          <label
            key={item.key ?? item.value}
            className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-sm font-medium transition hover:bg-neutral-100"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 rounded border-neutral-400 accent-black transition"
                checked={item.isRefined}
                onChange={() => {
                  // Navigate to semantic routes for primary conditions

                  if (attribute !== "condition" || !item._values) {
                    refine(item.value);
                  } else {
                    // Toggle all case variants together
                    for (const v of item._values) refine(v);
                  }
                }}
              />
              <span>{item.label}</span>
            </div>
            <span className="text-xs text-neutral-500">({item.count})</span>
          </label>
        ))}

        {/* Show more button for items beyond the first 10 */}
        {filteredItems.length > 10 && (
          <button
            className="text-xs font-semibold text-neutral-600 transition hover:text-black"
            onClick={() => {
              // TODO: Implement show more functionality
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
