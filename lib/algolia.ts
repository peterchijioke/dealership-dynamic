import {
  algoliasearch,
  type SearchParams,
  type SearchResponse,
} from "algoliasearch";
import type { VehicleHit } from "@/types/vehicle";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
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
      indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON!,
      searchParams: options,
    }
  );

  return response;
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

export {
  client,
  search,
  refinementListToAlgoliaFilters,
  refinementToFacetFilters,
  updateFacetFilter,
};
