"use client";

import { refinementToUrl, urlParser2 } from "../url-formatter";

const srpIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON as string;

export const routing = {
  router: {
    cleanUrlOnDispose: false,
    windowTitle(routeState: any) {
      const indexState = routeState.indexName || {}

      if (!indexState.query) {
        return 'MyWebsite - Results page'
      }

      return `MyWebsite - Results for: ${indexState.query}`
    },
    createURL({ routeState, location }: { routeState: any, location: any }) {
      // console.log("createURL:", routeState);
      // return typeof routeState === "string" ? routeState : "/";
      return routeState;
    },

    parseURL({ location }: { location: any }) {
      const pathname = location.pathname;
      const searchParams = new URLSearchParams(location.search);

      const { params } = urlParser2(pathname, searchParams);

      // console.log("parseURL:", location, params);
      return {
        refinementList: params,
        query: searchParams.get("query") || "",
      };
    },
  },

  stateMapping: {
    stateToRoute(uiState: any) {
      const indexUiState = uiState[srpIndex] || {};

      const filters = indexUiState.refinementList || {};
      // console.log("stateToRoute:", filters);
      return refinementToUrl(filters);
    },

    routeToState(routeState: any) {
      // Map back into Algolia’s uiState shape
      // console.log("routeToState:", routeState.refinementList || {});
      return {
        [srpIndex]: {
          query: routeState.query || "",
          refinementList: routeState.refinementList || {},
        },
      };
    },
  },
};
