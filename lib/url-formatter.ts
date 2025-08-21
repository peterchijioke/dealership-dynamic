import {
  appendParam,
  orderParams,
  recordToSearchParams,
  searchParamsToCommaSeparatedQuery,
  searchParamsToRecord,
  slugify,
} from "./helpers";

type UrlPattern = { pathname: string; params: { [x: string]: string[] } };

export function getLeadingPathSegment(pathname: string): string {
  const validPaths = [
    "/used-vehicles/certified", // longest first
    "/used-vehicles",
    "/new-vehicles",
  ];

  if (!pathname || pathname === "/") return "/new-vehicles";

  const matched = validPaths.find((p) => pathname.startsWith(p));
  return matched ?? "/new-vehicles";
}

export function urlParser(
  pathname: string,
  params: URLSearchParams,
  attribute: string,
  value: string[]
): { pathname: string; params: URLSearchParams } {
  let make = "";
  let model = "";
  let queryparams = searchParamsToRecord(params);
  const attributeValue = Array.isArray(value) ? value[-1] : value;

  const condition = getLeadingPathSegment(pathname);

  // strip off the condition path
  const remaining = pathname.replace(condition, "").split("/").filter(Boolean);

  if (remaining.length === 2) {
    make = remaining[0];
    model = remaining[1];
  } else if (remaining.length === 1) {
    if (attribute === "make") make = remaining[0];
    if (attribute === "model") model = remaining[0];
  }

  if (attribute === "make") {
    const newMake = slugify(attributeValue);

    if (make) queryparams = appendParam(queryparams, "make", make);
    if (model) queryparams = appendParam(queryparams, "model", model);

    make = newMake;
  }

  if (attribute === "model") {
    const newModel = slugify(attributeValue);

    if (model) queryparams = appendParam(queryparams, "model", model);
    if (make) queryparams = appendParam(queryparams, "make", make);

    model = newModel;
  }

  // Build new pathname
  let newPath = condition;
  if (make) newPath += `/${make}`;
  if (model) newPath += `/${model}`;
  params = orderParams(recordToSearchParams(queryparams));

  return { pathname: newPath, params };
}

export function getLeadingUrlPattern(condition: string[]): UrlPattern {
  if (!condition || condition.length === 0) {
    return { pathname: "/new-vehicles", params: {} }; // default fallback
  }

  const normalize = (val: string) => val.trim().toLowerCase();

  // normalize all values
  const normalized = condition.map(normalize);
  const last = normalized[normalized.length - 1];

  const hasUsed =
    normalized.includes("used") ||
    normalized.includes("pre-owned") ||
    normalized.includes("preowned");
  const hasCertified = normalized.includes("certified");

  // Rule 1: Only New
  if (last === "new" && condition.length === 1) {
    return { pathname: "/new-vehicles", params: {} };
  }

  // Rule 2: Only Used / Pre-Owned
  if (
    (last === "used" || last === "pre-owned" || last === "preowned") &&
    condition.length === 1
  ) {
    return { pathname: "/used-vehicles", params: {} };
  }

  // Rule 3: New + Used/Pre-Owned together → certified
  if (last === "new" && hasUsed) {
    return {
      pathname: "/used-vehicles/certified",
      params: { condition: ["new"] },
    };
  }

  // Rule 4: Used + Certified together → certified
  if (
    (last === "used" || last === "pre-owned" || last === "preowned") &&
    hasCertified
  ) {
    return { pathname: "/used-vehicles/certified", params: {} };
  }

  // Default fallback
  return { pathname: "/new-vehicles", params: {} };
}

export function getSubUrlPattern(
  attribute: string,
  attrArr: string[]
): UrlPattern {
  if (!attrArr || attrArr.length === 0) return { pathname: "", params: {} };

  const lastElement = slugify(attrArr[attrArr.length - 1]);
  if (attrArr.length === 1) return { pathname: `/${lastElement}`, params: {} };

  const restElements = attrArr.slice(0, -1);
  return {
    pathname: `/${lastElement}`,
    params: { [attribute]: restElements.map(slugify) },
  };
}

export function refinementToUrl(filters: Record<string, string[]>): string {
  const { condition, make, model, ...rest } = filters;
  const conditionFilter = condition || [];
  const makeFilter = make || [];
  const modelFilter = model || [];

  const leadingUrl = getLeadingUrlPattern(conditionFilter);
  const makeUrl = getSubUrlPattern("make", makeFilter);
  const modelUrl = getSubUrlPattern("model", modelFilter);

  const queryParams = orderParams(
    recordToSearchParams({
      ...rest,
      ...(leadingUrl.params || {}),
      ...(makeUrl.params || {}),
      ...(modelUrl.params || {}),
    })
  );

  const queryParamsString = searchParamsToCommaSeparatedQuery(queryParams);
  return `${leadingUrl.pathname}${makeUrl.pathname}${modelUrl.pathname}?${queryParamsString}`;
}
