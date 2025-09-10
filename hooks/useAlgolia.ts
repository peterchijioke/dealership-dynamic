"use client";

import { parsePathRefinements } from "@/lib/algolia";
import { urlToRefinement } from "@/lib/helpers";
import { refinementToUrl } from "@/lib/url-formatter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export function useAlgolia() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  // const pathname = usePathname();

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
    const url = filters ? refinementToUrl(filters) : "/new-vehicles";
    // router.push(url, { scroll: false });
    // window.history.pushState({}, "title", url);
    setTimeout(() => {
      window.history.pushState({}, "title", url);
    }, 0);
  }

  function routeToState() {
    return urlToRefinement(window.location.pathname + window.location.search);
  }

  // Listen for back/forward navigation
  useEffect(() => {
    const handler = () => {
      const refinements = routeToState();
      // dispatch refinements back into your app state
      window.dispatchEvent(
        new CustomEvent("algolia:popstate", { detail: refinements })
      );
    };

    window.addEventListener("popstate", handler);
    // console.log("Added popstate listener");
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return { filters, setFilter, stateToRoute, routeToState };
}

export function useRefinementsFromUrl() {
  const params = useSearchParams();
  const refinements: Record<string, string[]> = {};

  params.forEach((value, key) => {
    refinements[key] = value.split(",").filter(Boolean);
  });

  return refinements;
}

export function updateUrlWithFacets(
  pathname: string,
  pathRefinements: Record<string, string[]>,
  queryRefinements: Record<string, string[]>,
  router: any
) {
  const params = new URLSearchParams();

  Object.entries(queryRefinements).forEach(([facet, values]) => {
    if (values.length > 0) {
      params.set(facet, values.join(","));
    }
  });

  const queryString = params.toString();
  const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

  router.replace(newUrl, { scroll: false });
}

export function useAllRefinements() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathRefinements = useMemo(
    () => parsePathRefinements(pathname),
    [pathname]
  );

  const queryRefinements: Record<string, string[]> = {};
  searchParams.forEach((val, key) => {
    queryRefinements[key] = val.split(",").filter(Boolean);
  });

  const refinements = { ...pathRefinements, ...queryRefinements };

  const updateRefinements = (newQueryRefinements: Record<string, string[]>) => {
    const params = new URLSearchParams();
    Object.entries(newQueryRefinements).forEach(([facet, values]) => {
      if (values.length > 0) params.set(facet, values.join(","));
    });

    const qs = params.toString();
    const newUrl = qs ? `${pathname}?${qs}` : pathname;

    router.replace(newUrl, { scroll: false });
  };

  return { pathRefinements, queryRefinements, refinements, updateRefinements };
}
