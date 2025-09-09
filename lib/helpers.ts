export function slugify(str: string) {
  if (!str) return "";
  return str
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function unslugify(str: string): string {
  if (!str) return "";

  return str
    .split("-")
    .map((word) => {
      if (/^\d/.test(word)) return word; // keep numbers as-is
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function orderParams(params?: URLSearchParams): URLSearchParams {
  if (!params) return new URLSearchParams();

  // Define the priority order
  const priority = [
    "condition",
    "make",
    "model",
    "year",
    "trim",
    "price",
    "mileage",
  ];

  const entries: [string, string][] = [];

  // First collect prioritized keys in defined order
  for (const key of priority) {
    if (params.has(key)) {
      const values = params.getAll(key);
      values.forEach((v) => entries.push([key, v]));
    }
  }

  // Collect remaining keys (alphabetical for stability)
  for (const [key, value] of params.entries()) {
    if (!priority.includes(key)) {
      entries.push([key, value]);
    }
  }

  // Build final query string
  return new URLSearchParams(entries);
}

export function appendParam(
  params: Record<string, string | string[]>,
  key: string,
  value: string
) {
  if (!value) return params;

  const existing = params[key];

  if (!existing) {
    return { ...params, [key]: value };
  }

  if (Array.isArray(existing)) {
    if (!existing.includes(value)) {
      return { ...params, [key]: [...existing, value] };
    }
    return params;
  }

  // Handle comma-separated strings
  const parts = existing.split(",");
  if (!parts.includes(value)) {
    return { ...params, [key]: [...parts, value].join(",") };
  }
  return params;
}

export function recordToSearchParams(
  record: Record<string, string | string[]>
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(record).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });

  return params;
}

export function searchParamsToRecord(
  params: URLSearchParams
): Record<string, string | string[]> {
  const record: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    if (record[key]) {
      if (Array.isArray(record[key])) {
        (record[key] as string[]).push(value);
      } else {
        record[key] = [record[key] as string, value];
      }
    } else {
      record[key] = value;
    }
  });

  return record;
}

export function searchParamsToCommaSeparatedQuery(
  params: URLSearchParams
): string {
  const grouped: Record<string, string[]> = {};

  // Group by key
  for (const [key, value] of params.entries()) {
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(value);
  }

  // Join values with commas
  const parts = Object.entries(grouped).map(
    ([key, values]) => `${key}=${values.join(",")}`
  );

  return parts.length ? `${parts.join("&").replace(/%2C/g, ",")}` : "";
}

export function searchParamsToRecord2(
  params: URLSearchParams
): Record<string, string[]> {
  const record: Record<string, string[]> = {};

  for (const [key, value] of params.entries()) {
    record[key] = value.split(",");
  }

  return record;
}

export function recordToSearchParams2(
  record: Record<string, string[]>
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, values] of Object.entries(record)) {
    if (!values || values.length === 0) continue;
    // Join multiple values with comma
    params.set(key, values.join(","));
  }

  return params;
}

/**
 * Convert pathname + querystring into refinements object.
 * Handles:
 *   /new-vehicles → { condition: ["new"] }
 *   /used-vehicles/ford → { condition: ["used"], make: ["ford"] }
 *   /new-vehicles/ford/focus?year=2024,2023
 *   → { condition:["new"], make:["ford"], model:["focus"], year:["2024","2023"] }
 */
export function urlToRefinement(url: string): Record<string, string[]> {
  const u = new URL(url, window.location.origin); // base required for parsing
  const refinements: Record<string, string[]> = {};

  // ---- Path-based refinements ----
  const segments = u.pathname.split("/").filter(Boolean);

  if (segments.length > 0) {
    const [condition, make, model] = segments;

    if (condition === "new-vehicles" || condition === "used-vehicles") {
      refinements["condition"] = [
        condition.replace("-vehicles", "").toLowerCase(),
      ];
    }

    if (make && make !== "new-vehicles" && make !== "used-vehicles") {
      refinements["make"] = [make];
    }

    if (model) {
      refinements["model"] = [model];
    }
  }

  // ---- Query-based refinements ----
  u.searchParams.forEach((val, key) => {
    refinements[key] = val.split(",").filter(Boolean);
  });

  return refinements;
}

