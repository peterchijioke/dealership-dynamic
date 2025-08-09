import { X } from "lucide-react";
import {
  useClearRefinements,
  useCurrentRefinements,
  useInstantSearch,
} from "react-instantsearch";

export function VehicleFilterConditionDisplay() {
  const { setUiState } = useInstantSearch();
  const { items } = useCurrentRefinements();
  const { refine: clearAll, canRefine } = useClearRefinements();

  // Helper to format price & mileage values
  const formatRange = (min: number | null, max: number | null, suffix = "") => {
    if (min !== null && max !== null)
      return `${min.toLocaleString()} - ${max.toLocaleString()}${suffix}`;
    if (min !== null) return `From ${min.toLocaleString()}${suffix}`;
    if (max !== null) return `Up to ${max.toLocaleString()}${suffix}`;
    return "";
  };

  // Build a flat list of all refinements with display labels
  const allRefinements = items.flatMap((item: any) => {
    if (item.attribute === "price" || item.attribute === "mileage") {
      let min: number | null = null;
      let max: number | null = null;

      item.refinements.forEach((ref: any) => {
        const label = ref.label.trim();

        if (label.startsWith("≤")) {
          const val = Number(label.replace(/[^\d]/g, ""));
          if (!isNaN(val)) max = val;
        } else if (label.startsWith("≥")) {
          const val = Number(label.replace(/[^\d]/g, ""));
          if (!isNaN(val)) min = val;
        } else if (label.includes("-")) {
          const parts = label.split("-");
          if (parts.length === 2) {
            const minVal = Number(parts[0].replace(/[^\d]/g, ""));
            const maxVal = Number(parts[1].replace(/[^\d]/g, ""));
            if (!isNaN(minVal)) min = minVal;
            if (!isNaN(maxVal)) max = maxVal;
          }
        }
      });

      return item.refinements.length
        ? [
            {
              ...item.refinements[0],
              displayLabel:
                item.attribute === "price"
                  ? `$${formatRange(min, max)}`
                  : formatRange(min, max, " miles"),
              parentItem: item,
            },
          ]
        : [];
    }

    // Handle other refinements normally
    return item.refinements.map((ref: any) => ({
      ...ref,
      displayLabel: item.attribute === "is_special" ? "Special" : ref.label,
      parentItem: item,
    }));
  });

  return (
    <div className="flex w-full h-14  flex-wrap gap-2 px-3 sm:px-6 lg:px-4 pb-5 pt-4">
      {/* Individual refinement chips */}
      {allRefinements.map((ref: any, index: number) => (
        <div
          key={`${ref.attribute}-${ref.value}-${index}`}
          className="inline-flex items-center px-2 py-1 bg-rose-700 text-white rounded text-sm"
        >
          <span className="text-xs">{ref.displayLabel}</span>
          <button
            onClick={() => ref.parentItem.refine(ref)}
            className="ml-2 hover:bg-gray-200 rounded-full p-1 transition-colors"
            aria-label={`Remove filter ${ref.displayLabel}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}

      {/* Reset all filters */}
      {allRefinements.length > 0 && canRefine && (
        <button
          onClick={() => {
            setUiState({});
            clearAll();
          }}
          className="inline-flex items-center cursor-pointer border border-rose-700 px-2 py-1 bg-white text-black rounded text-sm"
          aria-label="Reset all filters"
        >
          <span className="text-xs">Reset Filters</span>
          <span className="ml-2 hover:bg-gray-200 rounded-full p-1 transition-colors">
            <X size={12} />
          </span>
        </button>
      )}
    </div>
  );
}
