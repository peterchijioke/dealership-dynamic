// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/algolia"; // Adjust the path to your algolia.ts

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get query parameters from URL
    const query = searchParams.get("query") || undefined;
    const hitsPerPage = searchParams.get("hitsPerPage")
      ? parseInt(searchParams.get("hitsPerPage")!, 10)
      : 10;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!, 10)
      : 0;

    // Optional: facets, attributes and facetFilters as comma-separated strings
    const facetsParam = searchParams.get("facets");
    const attributesParam = searchParams.get("attributesToRetrieve");
    const facetFiltersParam = searchParams.get("facetFilters");

    const facets = facetsParam ? JSON.parse(facetsParam) : undefined;
    const attributesToRetrieve = attributesParam
      ? JSON.parse(attributesParam)
      : undefined;

      console.log("Search API called with:", facets, attributesToRetrieve);

    // facetFilters: comma-separated inner arrays separated by ";"
    // Example: "category:clothing;brand:Nike,category:shoes"
    // becomes [["category:clothing","brand:Nike"],["category:shoes"]]
    let facetFilters: string[][] | undefined = undefined;
    if (facetFiltersParam) {
      facetFilters = facetFiltersParam
        .split(",")
        .map((group) => group.split(";"));
    }

    const results = await search({
      query,
      hitsPerPage,
      page,
      facets,
      attributesToRetrieve,
      facetFilters,
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
