import { InstantSearch } from "react-instantsearch";
import { searchClient, srpIndex } from "@/configs/config";

export default function SearchSSR() {
    return (
        <InstantSearch searchClient={searchClient} indexName={srpIndex}>
            {/* You don’t need to render Hits/Sidebar here – just enough to let Algolia prefetch */}
        </InstantSearch>
    );
}