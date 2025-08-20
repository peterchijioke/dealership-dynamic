import {
  algoliasearch,
  type SearchParams,
  type SearchResponse,
} from "algoliasearch";
import type { VehicleHit } from "@/types/vehicle";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_SEARCH_API_KEY!
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
  const response: SearchResponse<VehicleHit[]> = await client.searchSingleIndex({
    indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON!,
    searchParams: options,
  });

  return response;
}

export { client, search };
