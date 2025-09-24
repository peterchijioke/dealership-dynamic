// app/api/buildFacetCodes/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { client } from "@/lib/algolia";
import { srpIndex } from "@/configs/config";
import { slugify } from "@/lib/helpers";

export async function GET() {
  try {
    // 1. Get all facet counts in one call
    const res = await client.searchSingleIndex({
      indexName: srpIndex,
      searchParams: { facets: ["*"], maxValuesPerFacet: 1000 },
    });

    // 2. Convert facets → slug map
    const facetCodes: Record<string, Record<string, string>> = {};
    for (const [facetName, facetValues] of Object.entries(res.facets || {})) {
      facetCodes[facetName] = Object.fromEntries(
        Object.keys(facetValues).map((val) => [slugify(val), val])
      );
    }

    // 3. Save to file in project root
    const filePath = path.join(process.cwd(), "facetCodes.json");
    fs.writeFileSync(filePath, JSON.stringify(facetCodes, null, 2));

    return NextResponse.json({
      success: true,
      message: `facetCodes.json updated with ${
        Object.keys(facetCodes).length
      } attributes`,
    });
  } catch (err: any) {
    console.error("Error building facet codes:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
