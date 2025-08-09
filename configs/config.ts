import { liteClient as algoliasearch } from 'algoliasearch/lite';
export const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!);
export const vdpIndex=process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON_VDP
export const srpIndex=process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON
export const  getDynamicPath=():string=>process.env.NEXT_PUBLIC_HOST ??""
export const getWebsiteInformationPath=()=>`/${getDynamicPath()}/get-website-information`