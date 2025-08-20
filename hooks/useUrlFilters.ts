"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUrlFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read filters from URL
  const filters = Object.fromEntries(searchParams.entries());

  // Update filters in URL
  function setFilter(key: string, value?: string | string[]) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return { filters, setFilter };
}
