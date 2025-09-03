import {
  algoliasearch,
  type SearchParams,
  type SearchResponse,
} from "algoliasearch";
import { createInMemoryCache } from "@algolia/cache-in-memory";
import type { VehicleHit } from "@/types/vehicle";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
  {
    responsesCache: createInMemoryCache(),
    requestsCache: createInMemoryCache(),
  }
);

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON!;

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
      indexName,
      searchParams: options,
    }
  );

  return response;
}

async function searchWithMultipleQueries(options: SearchOptions) {
  const mainQuery = {
    indexName,
    params: {
      ...options,
      facets: ["*"], // request facets with filtered counts
    },
  };

  const facetQuery = {
    indexName,
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
      facetFilters: [], // global facet counts
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
    const vehicle = await client.getObject({ indexName, objectID });
    return vehicle;
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

export {
  client,
  search,
  searchWithMultipleQueries,
  refinementListToAlgoliaFilters,
  refinementToFacetFilters,
  refinementToFacetFilters2,
  updateFacetFilter,
};
