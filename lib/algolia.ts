import {
  algoliasearch,
  type SearchParams,
  type SearchResponse,
} from "algoliasearch";
import { createInMemoryCache } from "@algolia/cache-in-memory";
import type { VehicleHit } from "@/types/vehicle";
import { CATEGORICAL_FACETS, srpIndex, vdpIndex } from "@/configs/config";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
  {
    responsesCache: createInMemoryCache(),
    requestsCache: createInMemoryCache(),
  }
);

// await client.setSettings({
//   indexName: srpIndex,
//   indexSettings: {
//     attributesForFaceting: [
//       "make",
//       "hierarchicalCategories:model_trim",
//       "condition",
//       "year",
//       "body",
//       "fuel_type",
//       "ext_color",
//       "int_color",
//       "drive_train",
//       "transmission",
//     ],
//   },
// });

type SearchOptions = SearchParams & {
  query?: string;
  facets?: string[];
  facetFilters?: string[][];
  numericFilters?: string[];
  sortIndex?: string;
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
  const { sortIndex, ...searchParams } = options;
  const indexName = sortIndex || srpIndex;
  // console.log("Searching:", searchParams.facetFilters);

  // Main query (strict)
  const mainQuery = {
    indexName,
    params: {
      ...searchParams,
      facets: ["*"],
    },
  };

  // Adaptive facet queries
  const facetQueries = CATEGORICAL_FACETS.map((facet) => {
    const otherFacetFilters = (searchParams.facetFilters || []).filter(
      (filter) =>
        !(Array.isArray(filter)
          ? filter.some((f) => f.startsWith(`${facet}:`))
          : (filter as string).startsWith(`${facet}:`))
    );

    return {
      indexName,
      params: {
        ...searchParams,
        hitsPerPage: 0,
        facets: [facet],
        facetFilters: otherFacetFilters,
      },
    };
  });

  // Execute batch
  const response = await client.search([mainQuery, ...facetQueries]);

  const [hitsResult, ...facetResults] = response.results as [
    SearchResponse<VehicleHit>,
    ...SearchResponse<VehicleHit>[]
  ];

  // Start with strict facets (all refinements applied)
  const mergedFacets = { ...(hitsResult.facets || {}) };

  // Replace each facet with its adaptive distribution
  facetResults.forEach((result, i) => {
    const facetName = CATEGORICAL_FACETS[i];
    if (!result.facets || !result.facets[facetName]) return;

    mergedFacets[facetName] = Object.fromEntries(
      Object.entries(result.facets[facetName]).filter(
        ([, count]) => count > 0 // remove dead-ends
      )
    );
  });

  // Optional: sort year descending
  if (mergedFacets.year) {
    const sortedYears: Record<string, number> = {};
    const keys = Object.keys(mergedFacets.year).sort(
      (a, b) => Number(b) - Number(a)
    );
    for (const key of keys) {
      sortedYears[` ${key}`] = mergedFacets.year[key];
    }
    mergedFacets.year = sortedYears;
  }

  // console.log("hitsResult:", hitsResult);

  return {
    hits: hitsResult.hits,
    nbHits: hitsResult.nbHits,
    facets: mergedFacets,
    params: hitsResult.params,
    page: hitsResult.page,
    nbPages: hitsResult.nbPages,
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

/**
 * Convert selectedFacets object into Algolia facetFilters
 * Example:
 *   { make: ["Acura", "Ford"], year: ["2025"] }
 * → [ ["make:Acura", "make:Ford"], ["year:2025"] ]
 */
function generateFacetFilters(
  selectedFacets: Record<string, string[]>
): string[][] {
  return Object.entries(selectedFacets)
    .filter(([_, values]) => values && values.length > 0)
    .map(([facet, values]) => values.map((v) => `${facet}:${v}`));
}

function buildFacetFilters(
  refinements: Record<string, string[]>
): (string | string[])[] {
  return Object.entries(refinements)
    .filter(([_, vals]) => vals.length > 0)
    .map(([facet, vals]) => {
      // Special case: force string for is_special
      if (facet === "is_special") {
        return `${facet}:${String(vals[0])}`;
      }

      if (vals.length > 1) {
        // OR condition
        return vals.map((v) => `${facet}:${v}`);
      }

      // Single value
      return `${facet}:${vals[0]}`;
    });
}

function extractFacetFilters(params: string): Record<string, string[]> {
  // Parse querystring into key-value pairs
  const searchParams = new URLSearchParams(params);

  const facetFiltersParam = searchParams.get("facetFilters");
  if (!facetFiltersParam) return {};

  // Decode URI then parse JSON
  let facetFilters: string[][] = [];
  try {
    facetFilters = JSON.parse(decodeURIComponent(facetFiltersParam));
  } catch (e) {
    console.error("Failed to parse facetFilters:", e);
    return {};
  }

  // Convert [["condition:New"], ["make:Nissan"]] → { condition: ["New"], make: ["Nissan"] }
  const record: Record<string, string[]> = {};
  facetFilters.forEach((group) => {
    group.forEach((filter) => {
      const [key, value] = filter.split(":");
      if (!record[key]) record[key] = [];
      record[key].push(value);
    });
  });

  return record;
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
  generateFacetFilters,
  buildFacetFilters,
  extractFacetFilters,
};
