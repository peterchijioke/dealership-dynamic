import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";
import singletonRouter from 'next/router';

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
      uiState["prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp"] || {};

    const condition = indexUiState.refinementList?.condition?.[0];
    const make = indexUiState.refinementList?.make?.[0];
    const models = indexUiState.refinementList?.model || [];
    const years = indexUiState.refinementList?.year || [];

    console.log("condition:", indexUiState.refinementList?.condition)

    // 🔁 read toggle (hooks store it under `toggle`)
    const isSpecial =
      indexUiState.toggle?.is_special === true ||
      indexUiState.refinementList?.is_special?.includes("true"); // fallback if it ever comes from RL

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
    if (isSpecial) query.is_special = "true"; // <-- serialize toggle

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

    const make = segments[1];
    const modelSegment = segments[2];

    return {
      "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp": {
        refinementList: {
          ...(condition ? { condition: [condition] } : {}),
          ...(make ? { make: [make] } : {}),
          ...(modelSegment ? { model: [modelSegment] } : {}),
          ...(year ? { year: year.split(",") } : {}),
          ...(model ? { model: model.split(",") } : {}),
        },
        // 🔁 restore toggle from URL
        toggle: {
          ...(is_special === "true" ? { is_special: true } : {}),
        },
      },
    };
  },
};

export const nextRouter = createInstantSearchRouterNext({
  serverUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  singletonRouter
});
