export type LabelValue<ValueT = string> = {
  label: string;
  value: ValueT;
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

export type SpecialT = {
	subtitle: string;
	disclaimer: string;
	image_is_dynamic: boolean;
	special_types: string[];
	cashback_price: number;
	cashback_description: string;
	cta: VehicleCta[];
	start_at: string;
	channels: string[];
	msrp_price: number | null;
	sale_price: number | null;
	order: number;
	image_url: string;
	mobile_image_url: string;
	title: string;
	expire_at: string;
	finance_apr: number;
	finance_apr_month: number;
	finance_monthly_payment: number | null;
	lease_monthly_payment: string | number | undefined;
	lease_due_at_signing: number;
	lease_months: number;
	discounts: LabelValue[];
	coupon_description?: string;
	special_element: string;
	special_element_mobile: string;
	settings: Partial<{
		srp_banner_location: 'srp_banner_top' | 'srp_banner_inside';
	}>;
};

export type SpecialGroup = SpecialT[];

export type SpecialOfferT = {
	type: string;
} & any;
