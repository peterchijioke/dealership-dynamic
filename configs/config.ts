import { algoliasearch } from 'algoliasearch';
import { createInMemoryCache } from "@algolia/cache-in-memory";
import { createNullCache } from '@algolia/cache-common'

export const responsesCache = createInMemoryCache();
export const nullCache = createNullCache();

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
 
  {
    responsesCache: responsesCache,
    requestsCache: responsesCache,
  }
  
);
export const vdpIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON_VDP!
export const srpIndex=process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON!
export const  getDynamicPath=():string=>process.env.NEXT_PUBLIC_HOST!
export const baseUrl=process.env.NEXT_PUBLIC_API_BASE_URL!
export const getWebsiteInformationPath=()=>`/${getDynamicPath()}/v1/get-website-information`
export const algoliaSortOptions = [
  {
    label: "Relevance",
    value: srpIndex,
  },
  {
    label: "Price: Low to High",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_price_asc",
  },
  {
    label: "Price: High to Low",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_price_desc",
  },
  {
    label: "Mileage: Low to High",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_mileage_asc",
  },
  {
    label: "Mileage: High to Low",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_mileage_desc",
  },
  {
    label: "MPG City: Low to High",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_mpg_city_asc",
  },
  {
    label: "MPG City: High to Low",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_mpg_city_desc",
  },
  {
    label: "MPG Highway: Low to High",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_mpg_highway_asc",
  },
  {
    label: "MPG Highway: High to Low",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp_mpg_highway_desc",
  },
];

export const FACETS = [
  "condition",
  "year",
  "make",
  "model",
  "trim",
  "prices",
  "body",
  "drive_train",
  "fuel_type",
  "ext_color",
  "int_color",
  "transmission",
  "mileage",
  "is_special",
];

export const ATTRUBUTES_TO_RETRIEVE = [
  "objectID",
  "condition",
  "year",
  "make",
  "model",
  "trim",
  "prices",
  "photo",
  "video",
  "stock_number",
  "body",
  "drive_train",
  "ext_color",
  "int_color",
  "transmission",
  "mileage",
  "cta",
  "is_special",
];

export const CATEGORICAL_FACETS = [
  "condition",
  "make",
  "model",
  // "hierarchicalCategories:model_trim",
  "year",
  "body",
  "fuel_type",
  "ext_color",
  "int_color",
  "drive_train",
  "transmission",
  "doors",
  "engine",
  "key_features",
  "mileage",
  "is_special",
];
