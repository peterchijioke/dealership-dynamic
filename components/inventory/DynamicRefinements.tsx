import { useDynamicWidgets } from "react-instantsearch";
import FacetSection from "./FacetSection";

// Attributes to exclude from rendering
const EXCLUDED_ATTRIBUTES = new Set([
  "is_commercial",
  "is_in_transit",
  "is_new_arrival",
  "is_sale_pending",
]);

// Priority attributes that should appear in specific positions
const PRIORITY_ATTRIBUTES = ["is_special", "price"];

function getType(attribute: string): "list" | "toggle" | "range" {
  if (attribute === "is_special") return "toggle";
  if (attribute === "price" || attribute === "mileage") return "range";
  return "list";
}

function formatAttributeLabel(attribute: string): string {
  return attribute
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function reorderAttributes(attributes: string[]): string[] {
  const specialIndex = attributes.indexOf("is_special");
  const priceIndex = attributes.indexOf("price");

  // Remove priority attributes from their current positions
  const otherAttributes = attributes.filter(
    (attr) => !PRIORITY_ATTRIBUTES.includes(attr)
  );

  const orderedAttributes = [...otherAttributes];

  // Insert is_special at position 1 (2nd item) if it exists
  if (specialIndex !== -1) {
    orderedAttributes.splice(1, 0, "is_special");
  }

  // Insert price at position 2 (3rd item) if it exists
  if (priceIndex !== -1) {
    const insertIndex = specialIndex !== -1 ? 2 : 1;
    orderedAttributes.splice(insertIndex, 0, "price");
  }

  return orderedAttributes;
}

export default function DynamicRefinements() {
  const { attributesToRender } = useDynamicWidgets({
    maxValuesPerFacet: 500,
  });

  // Filter out excluded attributes and reorder priority ones
  const processedAttributes = reorderAttributes(
    attributesToRender.filter(
      (attribute) => !EXCLUDED_ATTRIBUTES.has(attribute)
    )
  );

  return (
    <>
      {processedAttributes.map((attribute) => (
        <FacetSection
          key={attribute}
          attribute={attribute}
          label={formatAttributeLabel(attribute)}
          type={getType(attribute)}
        />
      ))}
    </>
  );
}
