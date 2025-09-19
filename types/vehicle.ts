import { CTAButton } from "@/app/(routes)/vehicle/_components/VdpVehicleCard";

export type AlgoliaMatchLevel = "none" | "partial" | "full";

export interface AlgoliaHighlight {
  value: string;
  matchLevel: AlgoliaMatchLevel;
  matchedWords: string[];
}

export type ISODateString = `${number}-${number}-${number}`; // e.g., "2025-06-23"

export type CTADevice = "mobile" | "desktop" | "both";
export type CTAType = "form" | "link";
export type CTALocation = "srp" | "vdp" | "both";

/**
 * Maps a data shape T to its Algolia `_highlightResult` equivalent:
 * - primitives (string | number | boolean) -> AlgoliaHighlight
 * - arrays -> array of DeepHighlight of the element
 * - objects -> keyed object of DeepHighlight
 */
export type DeepHighlight<T> = T extends string | number | boolean
  ? AlgoliaHighlight
  : T extends (infer U)[]
  ? DeepHighlight<U>[]
  : T extends object
  ? { [K in keyof T]?: DeepHighlight<T[K]> }
  : never;

  export interface ButtonStyles {
    bg: string;
    bg_hover: string;
    text_color: string;
    text_hover_color: string;
  }
  

export interface PriceBreakdown {
  total_discounts: number;
  sale_price_label: string | null;
  total_additional: number;
  retail_price_label: string | null;
  sale_price_formatted: string | null;
  dealer_discount_label: string | null;
  dealer_discount_total: number;
  total_discounts_label: string | null;
  retail_price_formatted: string | null;
  total_additional_label: string | null;
  dealer_additional_label: string | null;
  dealer_additional_total: number;
  dealer_discount_details: unknown[];
  dealer_sale_price_label: string | null;
  incentive_discount_label: string | null;
  incentive_discount_total: number;
  dealer_additional_details: unknown[];
  total_discounts_formatted: string | null;
  incentive_additional_label: string | null;
  incentive_additional_total: number;
  incentive_discount_details: unknown[];
  total_additional_formatted: string | null;
  dealer_sale_price_formatted: string | null;
  incentive_additional_details: unknown[];
}

export interface Vehicle {
  year: string;
  days_in_stock: number;
  id: string;
  make: string;
  model: string;
  price: number;
  vin: string;
  city: string;
  state: string;
  sale_price: number;
  trim: string;
  retail_price: number | null;
  doors: number;
  prices: {
    total_discounts: number;
    sale_price_label: string;
    total_additional: number;
    retail_price_label: string | null;
    sale_price_formatted: string;
    dealer_discount_label: string | null;
    dealer_discount_total: number;
    total_discounts_label: string | null;
    retail_price_formatted: string | null;
    total_additional_label: string | null;
    dealer_additional_label: string | null;
    dealer_additional_total: number;
    dealer_discount_details: any[];
    dealer_sale_price_label: string | null;
    incentive_discount_label: string | null;
    incentive_discount_total: number;
    dealer_additional_details: any[];
    total_discounts_formatted: string | null;
    incentive_additional_label: string | null;
    incentive_additional_total: number;
    incentive_discount_details: any[];
    total_additional_formatted: string | null;
    dealer_sale_price_formatted: string;
    incentive_additional_details: any[];
  };
  body: string;
  vehicle_dealer_id: string[];
  drive_train: string;
  fuel_type: string;
  cta: CTAButton[];
  ext_color: string;
  tag: any[];
  ext_color_raw: string;
  int_color: string;
  description: string | null;
  int_color_raw: string;
  is_carfax_one_owner: boolean;
  mileage: number;
  carfax_icon_url: string | null;
  carfax_url: string | null;
  key_features: string[];
  vin_number: string;
  oem_incentives: any[];
  title: string;
  dealer_name: string;
  mpg_highway: number | null;
  dealer_address: string;
  mpg_city: number | null;
  dealer_city: string;
  subtitle: string;
  stock_number: string;
  dealer_state: string;
  dealer_zip_code: string;
  condition: string;
  is_special: boolean;
  photo: string;
  is_in_transit: boolean;
  is_commercial: boolean;
  video: string | null;
  is_sale_pending: boolean;
  video_subtitle: string | null;
  is_new_arrival: boolean;
  transmission: string;
  engine: string;
  disclaimers: {
    new: string;
    used: string;
    certified: string;
    // keep extensible
    [k: string]: string;
  };
  objectID: string;
  _highlightResult: {
    year: HighlightResult;
    make: HighlightResult;
    model: HighlightResult;
    trim: HighlightResult;
    body: HighlightResult;
    drive_train: HighlightResult;
    fuel_type: HighlightResult;
    ext_color: HighlightResult;
    ext_color_raw: HighlightResult;
    key_features: HighlightResult[];
    vin_number: HighlightResult;
    dealer_city: HighlightResult;
    stock_number: HighlightResult;
    dealer_state: HighlightResult;
    condition: HighlightResult;
    transmission: HighlightResult;
    engine: HighlightResult;
  };
  __position: number;
}

export interface VDPType {
  key_features: string[];
  inventory_date: ISODateString;

  prices: PriceBreakdown;

  cta: CTAButton[];

  // HTML strings per condition
  disclaimers: {
    new: string;
    used: string;
    certified: string;
    // keep extensible
    [k: string]: string;
  };

  description: string;

  features: string[];

  // Unknown/optional dealer-coordination details; currently null in sample
  dealer_coordination: Record<string, unknown> | null;

  photos: string[];
  videos: string[]; // empty in sample but allow future URLs/IDs

  objectID: string;

  // Deeply-typed Algolia highlight results for the fields present above
  _highlightResult?: DeepHighlight<
    Pick<
      VDPType,
      | "inventory_date"
      | "prices"
      | "cta"
      | "disclaimers"
      | "description"
      | "features"
      | "photos"
    >
  > & {
    // allow other highlight keys Algolia may inject (e.g., extra fields)
    [key: string]: unknown;
  };

  __position?: number; // Algolia position within results
}

export interface VehicleHit {
  hits: Vehicle[];
  nbHits: number;
  page: number;
  nbPages?: number;
  facets?: Record<string, Record<string, number>>;
  objectID?: string;
}

export interface VehicleFacet {
  [key: string]: { [key: string]: number };
}

export interface FacetFilters {
  [key: string]: string[] | number[] | undefined;
}

interface HighlightResult {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}








export type VehicleBaseT = {
	vehicle_id: string;
	photo: string;
	photos: string[];
	title: string;
	subtitle: string;
	prices: PriceT;
	cta: VehicleCta[];
	condition: ConditionT;
	stock_number: string;
	int_color: string;
	int_color_raw: string;
	ext_color: string;
	ext_color_raw: string;
	srp_cards_template: SRPCardTemplate;
	photo_preview: string;
	photos_preview: string[];
	certified_logo?: string;
	id: string;
	mileage: number;
	length_unit: string;
	price: number;
	is_special: boolean;
	vdp_url: string;
	carfax_url: string;
	carfax_icon_url: string;
	video: string;
	vin_number: string;
	key_features: string[];
	srp_cards_items: { value: string; label: string }[];
	tag: TagT[];
	model: string;
	make: string;
	trim: string;
	disclaimers: any;
	dealer_id: string;
	description: string;
	year: string;
	fuel_type: string;
	transmission: string;
	drive_train: string;
	doors: number;
	dealer_name: string;
	dealer_url: string;
	dealer_address: string;
	dealer_city: string;
	dealer_state: string;
	engine: string;
	mpg_city: number;
	mpg_highway: number;
	body: string;
	oem_incentives: OemIncentiveT[];
	default_payment: any;
	srp_template: string;
	vehicle_dealer_id: string[];
};

export type ConditionT = 'new' | 'used' | 'certified';

export type PriceT = {
	total_discounts: number;
	sale_price_label: string;
	total_additional: number;
	retail_price_label: string;
	sale_price_formatted: string;
	dealer_discount_label: string;
	dealer_discount_total: number;
	total_discounts_label: string;
	retail_price_formatted: string;
	total_additional_label: string;
	dealer_additional_label: string;
	dealer_additional_total: number;
	dealer_discount_details: PriceDetail[];
	dealer_sale_price_label: string;
	incentive_discount_label: string;
	incentive_discount_total: number;
	dealer_additional_details: PriceDetail[];
	total_discounts_formatted: string;
	incentive_additional_label: string;
	incentive_additional_total: number;
	incentive_discount_details: PriceDetail[];
	total_additional_formatted: string;
	dealer_sale_price_formatted: string;
	incentive_additional_details: PriceDetail[];
	discounts_details?: PriceDetail[];
};

export type SRPCardTemplate =
	| 'theme1'
	| 'theme2'
	| 'theme3'
	| 'theme4'
	| 'theme5'
	| 'theme7'
	| 'theme6'
	| 'default_theme';

export type PriceDetail = {
	title: string;
	value: string;
	disclaimer: string;
};

export type VehicleCta = {
	device: 'both' | 'mobile' | 'desktop';
	cta_type: 'form' | 'link' | 'roadster' | 'html';
	cta_label: string;
	btn_styles: {
		bg: string;
		bg_hover: string;
		text_color: string;
		text_hover_color: string;
	};
	btn_classes: string[];
	btn_content: string;
	open_newtab: boolean;
	cta_location: 'both';
	btn_attributes: { [key: string]: string };
};

export type TagT = {
	tag_background: string;
	tag_color: string;
	tag_content: string;
	tag_disclaimer: string;
	tag_type: 'top_label' | 'badge';
};

export type OemIncentiveT = {
	id: string;
	make: string;
	trim: string;
	year: string;
	model: string;
	style: string;
	title: string;
	start_at: string;
	subtitle: string;
	discounts: any;
	expire_at: string;
	image_url: string;
	is_active: boolean;
	disclaimer: string;
	msrp_price: any;
	sale_price: any;
	drive_train: string;
	finance_apr?: number;
	lease_months: any;
	cashback_price?: number;
	incentive_type: string;
	is_price_applied: boolean;
	finance_apr_month?: number;
	is_applies_to_all: boolean;
	is_active_adjusted: boolean;
	cashback_description?: string;
	lease_due_at_signing: any;
	lease_monthly_payment: any;
	finance_monthly_payment: any;
	is_price_applied_default: boolean;
	is_price_applied_adjusted: boolean;
};
