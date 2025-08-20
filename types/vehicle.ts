export interface Vehicle {
  year: string;
  days_in_stock: number;
  id: string;
  make: string;
  model: string;
  price: number;
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
  cta: {
    device: string;
    cta_type: string;
    cta_label: string;
    btn_styles: {
      bg: string;
      bg_hover: string;
      text_color: string;
      text_hover_color: string;
    };
    btn_classes: any[];
    btn_content: string;
    open_newtab: boolean;
    cta_location: string;
    btn_attributes: Record<string, any>;
  }[];
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

export interface VehicleHit {
  hits: Vehicle[];
  nbHits: number;
  page: number;
  nbPages?: number;
  facets?: Record<string, Record<string, number>>;
}

export interface VehicleFacet {
  value: string;
  count: number;
}

interface HighlightResult {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export type VehicleCta = {
	device: "both" | "mobile" | "desktop";
	cta_type: "form" | "link" | "roadster" | "html";
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
	cta_location: "both";
	btn_attributes: { [key: string]: string };
};

export type TagT = {
	tag_background: string;
	tag_color: string;
	tag_content: string;
	tag_disclaimer: string;
	tag_type: "top_label" | "badge";
};