import { liteClient as algoliasearch } from 'algoliasearch/lite';
export const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!);
export const vdpIndex=process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON_VDP
export const srpIndex=process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON
export const  getDynamicPath=():string=>process.env.NEXT_PUBLIC_HOST ??""
export const baseUrl=process.env.NEXT_PUBLIC_API_BASE_URL!
export const getWebsiteInformationPath=()=>`/${getDynamicPath()}/get-website-information`
export const algoliaSortOptions = [
  {
    label: "Relevance",
    value: "prod_73d6c4fc8ffb471e88c45e8eeddc1c63_srp",
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
