"use client";

import { refinementToUrl, urlParser2 } from "../url-formatter";

const srpIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON as string;

export const routing = {
  router: {
    cleanUrlOnDispose: false,
    windowTitle(routeState: any) {
      const indexState = routeState.indexName || {}

      if (!indexState.query) {
        return 'Dealership - Results page'
      }

      return `Dealership - Results for: ${indexState.query}`
    },
    createURL({ routeState, location }: { routeState: any, location: any }) {
      // console.log("createURL:", routeState);
      // return typeof routeState === "string" ? routeState : "/";
      // return `${process.env.NEXT_PUBLIC_SITE_URL}${routeState}`;
      const filters = routeState.refinementList || {};
      return refinementToUrl(filters);
    },

    parseURL({ location }: { location: any }) {
      const pathname = location.pathname;
      const searchParams = new URLSearchParams(location.search);

      const { params } = urlParser2(pathname, searchParams);

      console.log("parseURL:", params);
      return {
        query: searchParams.get("query") || "",
        refinementList: params,
      };
    },
  },

  stateMapping: {
    stateToRoute(uiState: any) {
      const indexUiState = uiState[srpIndex] || {};

      // const filters = indexUiState.refinementList || {};
      // console.log("stateToRoute:", refinementToUrl(filters));
      // return refinementToUrl(filters);
      console.log("stateToRoute:", indexUiState.refinementList || {});
      return {
        query: indexUiState.query || "",
        refinementList: indexUiState.refinementList || {},
      };
    },

    routeToState(routeState: any) {
      // Map back into Algolia’s uiState shape
      console.log("routeToState:", routeState.refinementList || {}, srpIndex);
      return {
        [srpIndex]: {
          query: routeState.query || "",
          refinementList: routeState.refinementList || {},
        },
      };
    },
  },
};
