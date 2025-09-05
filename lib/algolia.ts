import {
  algoliasearch,
  type SearchParams,
  type SearchResponse,
} from "algoliasearch";
import { createInMemoryCache } from "@algolia/cache-in-memory";
import type { VehicleHit } from "@/types/vehicle";
import { srpIndex, vdpIndex } from "@/configs/config";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
  {
    responsesCache: createInMemoryCache(),
    requestsCache: createInMemoryCache(),
  }
);

type SearchOptions = SearchParams & {
  query?: string;
  facets?: string[];
  facetFilters?: string[][];
  hitsPerPage?: number;
  page?: number;
};

/**
 * Perform a typed search on the default Algolia index.
 * Returns hits of type `VehicleHit` and facets if requested.
 */
async function search(options: SearchOptions) {
  const response: SearchResponse<VehicleHit[]> = await client.searchSingleIndex(
    {
      indexName: srpIndex,
      searchParams: options,
    }
  );

  return response;
}

async function searchWithMultipleQueries(options: SearchOptions) {
  const facetsList = [
    "condition",
    "make",
    "model",
    "year",
    "body",
    "fuel_type",
    "ext_color",
    "int_color",
    "drive_train",
    "transmission",
  ];

  const mainQuery = {
    indexName: srpIndex,
    params: {
      ...options,
      facets: ["*"], // hits with their own facets (for current facet display)
    },
  };

  // Generate one facet query per facet (adaptive behavior)
  const facetQueries = facetsList.map((facet) => {
    // Exclude this facet’s refinements from its facet query
    const otherFacetFilters = (options.facetFilters || []).filter(
      (filter) =>
        !(Array.isArray(filter)
          ? filter.some((f) => f.startsWith(`${facet}:`))
          : (filter as string).startsWith(`${facet}:`))
    );

    return {
      indexName: srpIndex,
      params: {
        ...options,
        hitsPerPage: 0,
        facets: [facet],
        facetFilters: otherFacetFilters,
      },
    };
  });

  const response = await client.search([mainQuery, ...facetQueries]);

  const [hitsResult, ...facetResults] = response.results as [
    SearchResponse<VehicleHit>,
    ...SearchResponse<VehicleHit>[]
  ];

  // Merge facets into a single object
  const mergedFacets = facetResults.reduce<Record<string, any>>(
    (acc, result) => {
      return { ...acc, ...result.facets };
    },
    {}
  );

  return {
    ...hitsResult,
    facets: mergedFacets,
  };
}


async function searchWithMultipleQueriesOld(options: SearchOptions) {
  const mainQuery = {
    indexName: srpIndex,
    params: {
      ...options,
      facets: ["*"], // request facets with filtered counts
    },
  };

  const facetQuery = {
    indexName: srpIndex,
    params: {
      ...options,
      hitsPerPage: 0, // only facet counts
      facets: [
        "condition",
        "make",
        "model",
        "year",
        "body",
        "fuel_type",
        "ext_color",
        "int_color",
        "drive_train",
        "transmission",
      ],
      // filters: options.filters,
      facetFilters: options.facetFilters,
    },
  };

  const response = await client.search([mainQuery, facetQuery]);

  const results = response.results;
  if (!results || results.length < 2) {
    console.error("Algolia unexpected response:", response);
    throw new Error("Algolia response missing results");
  }

  const [hitsResult, facetsResult] = results as [
    SearchResponse<VehicleHit>,
    SearchResponse<VehicleHit>
  ];

  return {
    ...hitsResult,
    facets: facetsResult.facets,
  };
}

/**
 * Fetch a single vehicle by objectID from Algolia
 */
export async function getVehicleById(objectID: string): Promise<any> {
  try {
    const srpData = await client.getObject({
      indexName: srpIndex,
      objectID,
    });
    const vdpData = await client.getObject({
      indexName: vdpIndex,
      objectID,
    });
    return { srpData, vdpData };
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error("Error fetching vehicle:", error);
    return null;
  }
}

function updateFacetFilter(
  facet: Record<string, string[]>,
  attribute: string,
  value: string
): Record<string, string[]> {
  const current = facet[attribute] || [];
  const updated = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  return { ...facet, [attribute]: updated };
}

function refinementListToAlgoliaFilters(
  refList: Record<string, string[]>
): string {
  const filterParts: string[] = [];
  for (const [key, values] of Object.entries(refList)) {
    if (values.length) {
      if (
        key === "make" &&
        refList.model?.length === 1 &&
        values.length === 1
      ) {
        // special OR logic for single segment
        filterParts.push(`(make:${values[0]} OR model:${values[0]})`);
      } else {
        filterParts.push(values.map((v) => `${key}:${v}`).join(" OR "));
      }
    }
  }
  return filterParts.join(" AND ");
}

function refinementToFacetFilters(
  refinementList: Record<string, string[]>
): string[][] {
  return Object.entries(refinementList)
    .filter(([_, values]) => values.length > 0)
    .map(([facet, values]) => values.map((v) => `${facet}:${v}`));
}

function refinementToFacetFilters2(
  refinementList: Record<string, string[]>
): (string | string[])[] {
  return Object.entries(refinementList)
    .filter(([_, values]) => values.length > 0)
    .map(
      ([facet, values]) =>
        values.length > 1
          ? values.map((v) => `${facet}:${v}`) // OR group
          : `${facet}:${values[0]}` // single value
    );
}

function parsePathRefinements(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  const refinements: Record<string, string[]> = {};

  // Example: /new-vehicles → condition = ["new"]
  if (segments[0] === "new-vehicles") refinements["condition"] = ["new"];
  if (segments[0] === "used-vehicles") refinements["condition"] = ["used"];

  // If we have /condition/make
  if (segments[1]) {
    refinements["make"] = [decodeURIComponent(segments[1])];
  }

  // If we have /condition/make/model
  if (segments[2]) {
    refinements["model"] = [decodeURIComponent(segments[2])];
  }

  return refinements;
}

export {
  client,
  search,
  searchWithMultipleQueries,
  refinementListToAlgoliaFilters,
  refinementToFacetFilters,
  refinementToFacetFilters2,
  updateFacetFilter,
  parsePathRefinements,
};
