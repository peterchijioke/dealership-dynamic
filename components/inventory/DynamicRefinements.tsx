import FacetSection from "./FacetSection";

const facetAttributes = [
  { attribute: "condition", label: "Condition" },
  { attribute: "is_special", label: "Special" },
  { attribute: "price", label: "Price" },
  { attribute: "year", label: "Year" },
  { attribute: "make", label: "Make" },
  { attribute: "model", label: "Model" },
  { attribute: "body", label: "Body Style" },
  { attribute: "fuel_type", label: "Fuel Type" },
  { attribute: "ext_color", label: "Exterior Color" },
  { attribute: "int_color", label: "Interior Color" },
  { attribute: "drive_train", label: "Drivetrain" },
  { attribute: "transmission", label: "Transmission" },
  { attribute: "engine", label: "Engine" },
  { attribute: "doors", label: "Doors" },
  { attribute: "trim", label: "Trim" },
  { attribute: "key_features", label: "Key Features" },
  { attribute: "mileage", label: "Mileage" },
];

function getType(attribute: string): "list" | "toggle" | "range" {
  if (attribute === "is_special") return "toggle";
  if (attribute === "price" || attribute === "mileage") return "range";
  return "list";
}

export default function DynamicRefinements() {
  return (
    <>
      {facetAttributes.map(({ attribute, label }) => (
        <FacetSection
          key={attribute}
          attribute={attribute}
          label={label}
          type={getType(attribute)}
        />
      ))}
    </>
  );
}
