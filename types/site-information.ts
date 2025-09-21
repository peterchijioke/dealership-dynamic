export type WebSiteInformation = {
	name: string;
	slug: string;
	site_url: string;
	zip_code: string;
	address: string;
	city: string;
	state: string;
	country: string;
	latitude: number;
	longitude: number;
	logo_url: string;
	icon_url: string;
	main_photo_url: string;
	phone_numbers: TPhoneNumber[];
	email_addresses: TEmailAddress[];
	theme: ThemeT;
	search_theme: string;
	main_colors: string[];
	dealers: { name: string; city: string; state: string }[];
	navigation: TNavigation[];
	header: {
		theme: string;
	};
	footer: {
		theme: string;
	};
	footer_links: TFooterLink[];
	website_external_links: TExternalLink[];
	website_hero_ctas: THeroCta[];
	work_hours: TWorkHours;
	social_networks: TSocialNetwork[];
	website_scripts: TWebsiteScript[];
	website_hero_title: string;
	website_hero_subtitle: string;
	website_hero_image_url: string;
	website_hero_video_url: string;
	website_hero_type: string;
	website_hero_type_mobile: string;
	website_hero_image_url_mobile: string;
};

export type TWebsiteScript = {
	content: string;
	location: string;
	name: string;
	place: string;
};

export type TSocialNetwork = {
	label: string;
	value: string;
};

export type TPhoneNumber = {
	label: string;
	value: string;
};

export type TEmailAddress = {
	label: string;
	value: string;
};

export type TExternalLink = {
	label: string;
	value: string;
	is_opened_in_newtab: boolean;
};

export type THeroCta = {
	link: string;
	label: string;
};

export type TWorkHours = {
	label: string;
	value: {
		to: string;
		from: string;
		label: string;
		is_open: boolean;
	}[];
}[];

export type ThemeT = {
	[colorToken: string]: string;
};

export type TNavigation = {
	customClass: string;
	customId: string;
	label: string;
	link: string;
	open_new_tab: boolean;
	template: string;
	children: {
		customClass: string;
		customId: string;
		label: string;
		link: string;
		open_new_tab: boolean;
	}[];
};

export type TFooterLink = {
	customClass: string;
	customId: string;
	label: string;
	link?: string;
	open_new_tab: boolean;
	children: {
		customClass: string;
		customId: string;
		label: string;
		link: string;
		open_new_tab: boolean;
	}[];
};
