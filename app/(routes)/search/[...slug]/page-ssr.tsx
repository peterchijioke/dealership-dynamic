import { getServerState } from "react-instantsearch";
import { renderToString } from "react-dom/server";

import SearchClient from "./_components/search-client2";
import SearchSSR from "./_components/search-ssr";

export default async function SearchPage({ params }: { params: { slug: string[] } }) {

    // Run SSR for Algolia
    const serverState = await getServerState(<SearchSSR />, { renderToString });

    return <SearchClient serverState={serverState} />;
}
