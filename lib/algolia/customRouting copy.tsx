import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";

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

    // build path
    let pathname = "/new-vehicles";
    if (condition === "used") pathname = "/used-vehicles";

    if (make) pathname += `/${slugify(make)}`;
    if (models.length > 0) {
      const lastModel = models[models.length - 1];
      pathname += `/${slugify(lastModel)}`;
    }

    // build query
    const query: Record<string, string> = {};
    if (years.length > 0) query.year = years.join(",");
    if (models.length > 1) query.model = models.slice(0, -1).join(",");

    // ✅ Only return query params (no path!)
    return query;
  },

  routeToState(routeState: any) {
    const { year, model } = routeState;

    // read pathname directly from window.location
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    const segments = pathname.split("/").filter(Boolean);

    let condition: string | undefined = "new";
    if (segments[0] === "used-vehicles") condition = "used";

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
      },
    };
  },
};

// ✅ Pass pathname explicitly to router
export const nextRouter = createInstantSearchRouterNext({
  serverUrl: "http://localhost:3000",
  serverPathname: "/new-vehicles",
});
