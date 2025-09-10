import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";
import singletonRouter from 'next/router';

const srpIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON as string;

function slugify(str: string) {
  return str
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export const customStateMapping = {
  stateToRoute(uiState: any) {
    const indexUiState =
      uiState[srpIndex] || {};

    const condition = indexUiState.refinementList?.condition?.[0];
    const make = indexUiState.refinementList?.make?.[0];
    const models = Array.isArray(indexUiState.refinementList?.model)
      ? indexUiState.refinementList.model
      : [];

    const years = Array.isArray(indexUiState.refinementList?.year)
      ? indexUiState.refinementList.year
      : [];

    console.log("stateToRoute:", indexUiState.refinementList?.condition)

    const isSpecial =
      indexUiState.toggle?.is_special === true ||
      indexUiState.refinementList?.is_special?.includes("true");

    // build path
    let pathname = "/new-vehicles";
    if (condition === "Used") pathname = "/used-vehicles";
    if (make) pathname += `/${slugify(make)}`;
    if (models.length > 0) {
      const lastModel = models[models.length - 1];
      pathname += `/${slugify(lastModel)}`;
    }

    // build query
    const query: Record<string, string> = {};
    if (years.length > 0) query.year = years.join(",");
    if (models.length > 1) query.model = models.slice(0, -1).join(",");
    if (isSpecial) query.is_special = "true";

    return query; // only query params (path handled by actual route)
  },

  routeToState(routeState: any) {
    const { year, model, is_special } = routeState;

    // read pathname from the browser
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    const segments = pathname.split("/").filter(Boolean);

    let condition: string | undefined = "New";
    if (segments[0] === "used-vehicles") condition = "Used";

    const make = segments?.[1] ?? "";
    const modelSegment = segments?.[2] ?? "";

    return {
      [srpIndex]: {
        refinementList: {
          ...(condition ? { condition: [condition] } : {}),
          ...(make ? { make: [make] } : {}),
          ...(modelSegment ? { model: [modelSegment] } : {}),
          ...(year ? { year: year.split(",") } : {}),
          ...(model ? { model: model.split(",") } : {}),
        },

        toggle: {
          ...(is_special === "true" ? { is_special: true } : {}),
        },
      },
    };
  },
};

export const nextRouter = createInstantSearchRouterNext({
  serverUrl: process.env.NEXT_PUBLIC_SITE_URL,
  singletonRouter,
  routerOptions: {}
});
