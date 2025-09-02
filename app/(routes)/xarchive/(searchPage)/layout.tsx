import { headers } from "next/headers";
import { refinementToFacetFilters } from "@/lib/algolia";
import SearchClient from "./components/search-client";
import { urlParser2 } from "@/lib/url-formatter";

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers();
    const fullUrl = headerList.get("x-full-url");
    const url = new URL(fullUrl || "");

    // const pathname = `/${Object.values(url.pathname).filter(Boolean).join("/")}`;
    const searchParamsObj = new URLSearchParams(url.search);

    const { params: refinementList } = urlParser2(url.pathname, searchParamsObj);

    // Use Algolia search with parsed query & filters
    // const query = searchParamsObj.get("query") || "";
    const facetFilters = refinementToFacetFilters(refinementList);
    // console.log("facetFilters:", facetFilters);

    return (
        <SearchClient facetFilters={facetFilters}>
            {children}
        </SearchClient>
    );
}
