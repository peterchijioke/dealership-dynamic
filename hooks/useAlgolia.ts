"use client";

import { refinementToUrl, urlParser } from "@/lib/url-formatter";
import { useSearchParams, usePathname } from "next/navigation";

export function useAlgolia() {
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

    // const newUrl = urlParser(pathname, params, key, value);

    // if (!value || (Array.isArray(value) && value.length === 0)) {
    //   params.delete(key);
    // } else {
    //   const val = Array.isArray(value) ? value.join(",") : value;
    //   params.set(key, val);
    // }

    // Prevent %2C encoding of commas
    // const queryString = newUrl.params.toString().replace(/%2C/g, ",");

    // router.push(newUrl.pathname + (queryString ? `?${queryString}` : ""));
  }

  function stateToRoute(filters: Record<string, string[]>) {
    const url = refinementToUrl(filters);
    // router.push("/used-vehicles/certified", undefined, { shallow: false });
    window.history.pushState({}, "title", url);
  }
  function routeToState() {/* TO DO */}

  return { filters, setFilter, stateToRoute, routeToState };
}
