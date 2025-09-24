// components/vehicle/normalizePrices.ts

type DiscountLine = { title: string; value: string };

export type CanonicalPrices = {
  msrp?: string | null;
  sale?: string | null;
  totalDiscounts?: string | null;
  discountDetails: DiscountLine[];
  labels: {
    msrp: string;
    sale: string;
    totalDiscounts: string;
  };
};

export function normalizePrices(raw: unknown): CanonicalPrices | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;

  // Case 1: structured shape
  const isStructured =
    "retail_price_formatted" in p ||
    "dealer_sale_price_formatted" in p ||
    "sale_price_formatted" in p;

  if (isStructured) {
    const msrp =
      (p["retail_price_formatted"] as string | undefined) ||
      (p["MSRP"] as string | undefined) ||
      null;

    const sale =
      (p["dealer_sale_price_formatted"] as string | undefined) ||
      (p["sale_price_formatted"] as string | undefined) ||
      null;

    const totalDiscounts =
      (p["total_discounts_formatted"] as string | undefined) ||
      (typeof p["total_discounts"] === "number"
        ? `$${p["total_discounts"] as number}`
        : null);

    const dealerLines =
      (Array.isArray(p["dealer_discount_details"])
        ? (p["dealer_discount_details"] as DiscountLine[])
        : []) ?? [];

    const incentiveLines =
      (Array.isArray(p["incentive_discount_details"])
        ? (p["incentive_discount_details"] as DiscountLine[])
        : []) ?? [];

    return {
      msrp,
      sale,
      totalDiscounts,
      discountDetails: [...dealerLines, ...incentiveLines].filter(
        (d) => d && (d.title || d.value)
      ),
      labels: {
        msrp: "MSRP",
        sale: "Sale Price",
        totalDiscounts: "Total Discounts",
      },
    };
  }

  // Case 2: flat label:value map
  const entries = Object.entries(p);
  if (entries.length === 0) return null;

  const byKey = new Map(
    entries.map(([k, v]) => [k.trim().toLowerCase(), String(v)])
  );

  const msrp =
    byKey.get("msrp") ??
    byKey.get("retail") ??
    byKey.get("retail price") ??
    null;

  const sale =
    byKey.get("after all rebates") ??
    byKey.get("sale price") ??
    byKey.get("price") ??
    null;

  return {
    msrp,
    sale,
    totalDiscounts: byKey.get("discounts") ?? null,
    discountDetails: [],
    labels: {
      msrp: "MSRP",
      sale: byKey.has("after all rebates") ? "After all rebates" : "Sale Price",
      totalDiscounts: "Total Discounts",
    },
  };
}
