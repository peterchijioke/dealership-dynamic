"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUrlFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read filters from URL (split on commas if needed)
  const filters: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    filters[key] = value.split(",");
  });

  // Update filters in URL
  function setFilter(key: string, value?: string | string[]) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else {
      const val = Array.isArray(value) ? value.join(",") : value;
      params.set(key, val);
    }

    // Prevent %2C encoding of commas
    const queryString = params.toString().replace(/%2C/g, ",");

    router.push(`${pathname}?${queryString}`);
  }

  return { filters, setFilter };
}
