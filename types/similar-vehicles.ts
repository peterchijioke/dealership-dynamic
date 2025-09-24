// --- Core Feature Types ---
export interface FeatureItem {
  title: string;
  description: string;
}

export interface FeatureCategory {
  title: string;
  items: (FeatureCategory | FeatureItem)[];
}

// --- Incentives ---
export interface OemIncentive {
  id: string;
  make: string;
  trim: string;
  year: string;
  model: string;
  style: string;
  title: string;
  start_at: string;
  subtitle: string;
  discounts: any | null;
  expire_at: string;
  image_url: string;
  is_active: boolean;
  disclaimer: string;
  msrp_price: number | null;
  sale_price: number | null;
  drive_train: string | null;
  finance_apr: number | null;
  lease_months: number | null;
  cashback_price: number | null;
  incentive_type: "cashback" | "finance" | string;
  is_price_applied: boolean;
  finance_apr_month: number | null;
  is_applies_to_all: boolean;
  is_active_adjusted: boolean;
  cashback_description: string | null;
  lease_due_at_signing: number | null;
  lease_monthly_payment: number | null;
  finance_monthly_payment: number | null;
  is_price_applied_default: boolean;
  is_price_applied_adjusted: boolean;
}

// --- Dealer Contact Types ---
export interface DealerEmail {
  label: string;
  value: string;
  is_lead?: boolean;
  lead_format?: string;
}

export interface DealerPhone {
  label: string;
  value: string;
}

export interface DealerWorkHour {
  label: string;
  value: {
    from: string;
    to: string;
    label: string;
    is_open: boolean;
  }[];
}

// --- CTA (Call to Action) ---
export interface Cta {
  device: "both" | "mobile" | "desktop";
  cta_type: "form" | "link";
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
  cta_location: string;
  btn_attributes: Record<string, any>;
}

// --- Pricing ---
export interface PriceDetails {
  title: string;
  value: string;
  disclaimer: string;
}

export interface Prices {
  total_discounts: number;
  sale_price_label: string;
  total_additional: number;
  retail_price_label: string;
  sale_price_formatted: string;
  dealer_discount_label: string | null;
  dealer_discount_total: number;
  total_discounts_label: string;
  retail_price_formatted: string;
  total_additional_label: string | null;
  dealer_additional_label: string | null;
  dealer_additional_total: number;
  dealer_discount_details: any[];
  dealer_sale_price_label: string | null;
  incentive_discount_label: string;
  incentive_discount_total: number;
  dealer_additional_details: any[];
  total_discounts_formatted: string;
  incentive_additional_label: string | null;
  incentive_additional_total: number;
  incentive_discount_details: PriceDetails[];
  total_additional_formatted: string | null;
  dealer_sale_price_formatted: string;
  incentive_additional_details: any[];
}

// --- Tags ---
export interface VehicleTag {
  tag_type: string;
  tag_color: string;
  tag_content: string;
  tag_background: string;
  tag_disclaimer: string;
}

// --- Disclaimers ---
export interface Disclaimers {
  new: string;
  used: string;
  certified: string;
}

// --- Main Vehicle Type ---
export interface SimilarVehicle {
  id: string;
  vehicle_id: string;
  vin_number: string;
  title: string;
  subtitle: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  body: string;
  engine: string;
  transmission: string;
  drive_train: string;
  fuel_type: string;
  ext_color: string;
  ext_color_raw: string;
  int_color: string;
  int_color_raw: string;
  mileage: number;
  formatted_mileage: string;
  condition: "new" | "used" | "certified";
  doors: number;
  stock_number: string;
  model_number: string;
  price: number;
  sale_price: number;
  retail_price: number;
  mpg_city: number;
  mpg_highway: number;
  photos: string[];
  photos_preview: string[];
  photo: string;
  photo_preview: string;
  videos: string[];
  video: string;
  video_subtitle: string;
  categorized_features: FeatureCategory[];
  features: string[];
  key_features: string[];
  oem_incentives: OemIncentive[];
  applied_bulk_rule_ids: string[];
  presets_package_ids: string[] | null;
  inventory_special_ids: string[] | null;
  package_ids: string[] | null;
  dealer_id: string;
  dealer_slug: string;
  dealer_name: string;
  dealer_address: string;
  dealer_city: string;
  dealer_state: string;
  dealer_zip_code: string;
  dealer_url: string;
  dealer_coordination: any | null;
  dealer_email_addresses: DealerEmail[];
  dealer_phone_numbers: DealerPhone[];
  dealer_work_hours: DealerWorkHour[];
  is_special: boolean;
  is_showed: boolean;
  is_in_transit: boolean;
  is_commercial: boolean;
  is_sale_pending: boolean;
  is_sold: boolean;
  is_new_arrival: boolean;
  is_carfax_one_owner: boolean;
  carfax_icon_url: string | null;
  carfax_url: string | null;
  certified_logo: string | null;
  videos_preview?: string[];
  description: string;
  disclaimers: Disclaimers;
  extra_information: Record<string, any>;
  caching_hash: string;
  created_at: string;
  updated_at: string;
  inventory_date: string;
  default_payment: any | null;
  default_apr_value: number | null;
  apr_values: any | null;
  srp_template: string;
  srp_cards_template: string;
  srp_cards_items: { label: string; value: string }[];
  length_unit: "mile" | "km";
  is_incentives_open_as_default: boolean | null;
  cta: Cta[];
  tag: VehicleTag[];
  vehicle_dealer_id: string[];
  order: number;
  days_in_stock: number;
  subtitle_raw?: string;
  prices: Prices;
}
