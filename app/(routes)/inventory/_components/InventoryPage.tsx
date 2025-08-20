"use client";

import VehicleGrid from "../../../../components/inventory/VehicleGrid";
import {
  createInstantSearchNextInstance,
  InstantSearchNext,
} from "react-instantsearch-nextjs";
import { searchClient, srpIndex } from "@/configs/config";
import DynamicRefinements from "../../../../components/inventory/DynamicRefinements";
import { SearchInventory } from "../../../../components/inventory/search-inventory";
import CarouselBanner from "../../../../components/inventory/CarouselBanner";
import { Configure } from "react-instantsearch";
import { usePathname } from "next/navigation";
import { nextRouter, customStateMapping } from '@/lib/algolia/customRouting';

export default function InventoryPage() {
  const pathname = usePathname();
  if (!srpIndex) {
    return (
      <div className="pt-24 px-4 text-sm text-red-600">
        Missing NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON environment variable.
      </div>
    );
  }

  const indexName = srpIndex as string;
  const searchInstance = createInstantSearchNextInstance();

  // Helpers to encode/decode slugs with "+" for spaces
  const encodeSlug = (name: string) =>
    name
      .split(" ")
      .map((p) => encodeURIComponent(p))
      .join("+");

  const decodeSlug = (slug: string) =>
    slug
      .split("+")
      .map((p) => decodeURIComponent(p))
      .join(" ");

  const routing = {
    router: {
      createURL({ routeState, location }: any) {
        const base = `${location.origin}`;

        const allowedBases = new Set(["used-vehicles", "new-vehicles"]);
        // Keep the current basePath; don't switch paths based on condition
        let basePath: string | undefined = routeState.basePath;
        // Prefer provided basePath or infer from current URL, else default to used-vehicles
        if (!basePath || !allowedBases.has(basePath)) {
          const currentFirst = location.pathname.split("/").filter(Boolean)[0];
          basePath = allowedBases.has(currentFirst)
            ? currentFirst
            : "used-vehicles";
        }

        const parts: string[] = [basePath as string];
        if (routeState.makePath) parts.push(routeState.makePath);
        if (routeState.modelPath) parts.push(routeState.modelPath);
        const path = `/${parts.join("/")}/`;

        // Build query string with comma-separated lists and + for spaces
        const params: string[] = [];
        const addCsvParam = (key: string, val?: string[] | string) => {
          if (!val || (Array.isArray(val) && val.length === 0)) return;
          const values = Array.isArray(val) ? val : [val];
          const encoded = values.map((v) => encodeSlug(String(v))).join(",");
          params.push(`${key}=${encoded}`);
        };

        if (routeState.query) {
          params.push(`query=${encodeSlug(String(routeState.query))}`);
        }

        if (
          path.includes("/used-vehicles/") &&
          routeState.condition[0] !== "used"
        ) {
          addCsvParam("condition", routeState.condition[0]);
        }

        if (
          path.includes("/new-vehicles/") &&
          routeState.condition[0] !== "new"
        ) {
          addCsvParam("condition", routeState.condition[0]);
        }
        // Include condition explicitly in query string
        addCsvParam("make", routeState.make);
        addCsvParam("model", routeState.model);
        addCsvParam("trim", routeState.trim);

        const query = params.length ? `?${params.join("&")}` : "";

        console.log("==========path query==========================");
        console.log(params ?? "no condition");
        console.log("===========path query=========================");
        return `${base}${path}${query}`;
      },
      parseURL({ location }: any) {
        const url = new URL(location.href);
        const pathname = url.pathname.replace(/\/+$/, ""); // trim trailing /
        const segments = pathname.split("/").filter(Boolean);

        console.log("===========segments=========================");
        console.log(JSON.stringify(segments, null, 2));
        console.log("==========segments==========================");

        // Expect ["used-vehicles"|"new-vehicles", make?, model?]
        let basePath: string | undefined;
        let makePath: string | undefined;
        let modelPath: string | undefined;
        // if (
        //   segments.length > 0 &&
        //   ["used-vehicles", "new-vehicles"].includes(segments[0])
        // ) {
        //   basePath = segments[0];
        //   makePath = segments[1];
        //   modelPath = segments[2];
        // }

        if (segments.length > 0) {
          basePath = segments[0];
        }

        const sp = url.searchParams;
        const splitCsv = (v: string | null) =>
          v ? v.split(",").map((x) => decodeSlug(x)) : [];

        const query = sp.get("query")
          ? decodeSlug(sp.get("query") as string)
          : "";
        const condition = splitCsv(sp.get("condition"));
        const make = splitCsv(sp.get("make"));
        const model = splitCsv(sp.get("model"));
        const trim = splitCsv(sp.get("trim"));

        if (
          basePath?.includes("used-vehicles") &&
          !condition?.includes("used")
        ) {
          condition?.push("used");
        }
        if (basePath?.includes("new-vehicles")) {
          condition?.push("new");
        }
        return {
          // query,
          condition,
          // make,
          // model,
          // trim,
          basePath,
          // makePath,
          // modelPath,
        } as any;
      },
    },
    stateMapping: {
      stateToRoute(uiState: Record<string, any>) {
        const indexUiState = uiState[indexName] || {};
        const rl = (indexUiState.refinementList || {}) as Record<
          string,
          string[]
        >;
        const makeArr = rl.make || [];
        const modelArr = rl.model || [];
        const trimArr = rl.trim || [];
        const conditionArr = rl.condition || [];
        const lcConds = conditionArr.map((v) => (v || "").toLowerCase());
        // Normalize to a single condition for query param; prefer 'new' if both somehow present
        const conditionParam = lcConds.includes("new")
          ? ["new"]
          : lcConds.includes("used")
          ? ["used"]
          : [];
        // Preserve existing basePath; don't derive it from condition
        const basePath = indexUiState.internal?.basePath || "";
        console.log("===========stateToRoute=========================");
        console.log(conditionArr ?? "no condition");
        console.log("===========stateToRoute=========================");
        return {
          // query: indexUiState.query,
          condition: conditionParam,
          // make: makeArr,
          // model: modelArr,
          // trim: trimArr,
          basePath,
          // First selected make/model in path for aesthetics
          // makePath: makeArr[0] ? encodeSlug(makeArr[0]) : undefined,
          // modelPath: modelArr[0] ? encodeSlug(modelArr[0]) : undefined,
        } as any;
      },
      routeToState(routeState: any) {
        const basePath: string | undefined = routeState.basePath;
        const conds = Array.isArray(routeState.condition)
          ? routeState.condition.filter(Boolean) // keep as-is; no case changes
          : [];

        return {
          [indexName]: {
            refinementList: {
              // make: Array.isArray(routeState.make) ? routeState.make : [],
              // model: Array.isArray(routeState.model) ? routeState.model : [],
              // trim: Array.isArray(routeState.trim) ? routeState.trim : [],
              condition: conds,
            },
            internal: {
              basePath: basePath || "",
            },
          },
        } as any;
      },
    },
  } as const;

  return (
    <InstantSearchNext
      key={`is-${pathname}`}
      future={{
        preserveSharedStateOnUnmount: true,
        persistHierarchicalRootCount: true,
      }}
      // routing={routing}
      routing={{
        router: nextRouter as unknown as any,
        stateMapping: customStateMapping,
      }}
      instance={searchInstance}
      ignoreMultipleHooksWarning
      insights={true}
      indexName={indexName}
      searchClient={searchClient}
    >
      <Configure
        maxValuesPerFacet={1000}
        facets={["*"]}
        facetingAfterDistinct
        hitsPerPage={20}
      />
      <div className="h-screen flex flex-col relative pt-24 ">
        <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
          <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0">
            <div className="h-full overflow-y-auto px-2 pt-3">
              <DynamicRefinements />
            </div>
          </aside>

          {/* Right: main content area with its own scroll and proper padding */}
          <main className="flex-1 space-y-2 overflow-y-auto ">
            <CarouselBanner />
            <SearchInventory />
            <VehicleGrid />
            <div className="h-6" />
          </main>
        </div>

        {/* Mobile Drawer */}
      </div>
    </InstantSearchNext>
  );
}
