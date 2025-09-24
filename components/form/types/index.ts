import { LabelValue } from "@/types/general";

export type FormResponseT = {
	fields: FormFieldT[];
	location: string;
	id: string;
	title: string;
};

export type FormFieldT = {
	id: string;
	is_required: boolean;
	is_visible: boolean;
	default_value: string;
	field_type: FieldType;
	form_id: string;
	label: string;
	name: string;
	placeholder: string;
	display_grid: string;
	settings: {
		display_grid: string;
		vehicle?: boolean;
		value?: string;
		tag_name?: string;
		date_control_mode?: string;
		vin_number?: boolean;
	};
	tooltip: string;
	order: number;
	options?: LabelValue[];
};

type FieldType =
	| 'text'
	| 'email'
	| 'select'
	| 'tel'
	| 'hidden'
	| 'paragraph'
	| 'textarea'
	| 'checkbox'
	| 'radio'
	| 'submit'
	| 'date'
	| 'time'
	| 'file';

export type InventoryFieldResponse = {
	[field: string]: LabelValue[];
};
