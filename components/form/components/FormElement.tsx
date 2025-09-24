import { useFormContext } from 'react-hook-form';
import { FormFieldT } from '../types';
import { Fragment, useEffect, useState } from 'react';
import FieldRenderer from './FieldRenderer';

type FormElementProps = {
	field: FormFieldT;
	isPending: boolean;
	// index: number;
	setIsTextareaTouched?: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormElement = ({ field, isPending, setIsTextareaTouched }: FormElementProps) => {
	const { watch } = useFormContext();
	const watchAllFields = watch();
	const [isHidden, setIsHidden] = useState(false);
	useEffect(() => {
		if (watchAllFields !== undefined)
			if (field.name === 'previous_employer_name' || field.name === 'previous_employer_address') {
				if (watchAllFields['if_under_2_years_at_current_job']) {
					setIsHidden(false);
				} else {
					setIsHidden(true);
				}
			}

		if (
			field.name === 'previous_address' ||
			field.name === 'previous_city' ||
			field.name === 'previous_state' ||
			field.name === 'previous_zip_code' ||
			field.name === 'previous_monthly_payment_rent' ||
			field.name === 'previous_from_date' ||
			field.name === 'previous_to_date' ||
			field.name === 'previous_monthly_payment' ||
			field.name === 'previous_rent_or_own'
		)
			if (watchAllFields['if_at_address_for_less_than_2_years']) {
				setIsHidden(false);
			} else {
				setIsHidden(true);
			}

		if (
			field.name === 'previous_gross_monthly_income' ||
			field.name === 'previous_employer' ||
			field.name === 'previous_job_title' ||
			field.name === 'previous_employer_address' ||
			field.name === 'previous_employer_city' ||
			field.name === 'previous_employer_state' ||
			field.name === 'previous_employer_zip_code' ||
			field.name === 'previous_employer_phone_number' ||
			field.name === 'previous_employed_from_date' ||
			field.name === 'previous_employed_to_date'
		)
			if (watchAllFields['if_under_2_years_at_current_job']) {
				setIsHidden(false);
			} else {
				setIsHidden(true);
			}

		if (
			field.name === 'joint_applicant_info' ||
			field.name === 'ja_first_name' ||
			field.name === 'ja_last_name' ||
			field.name === 'ja_middle_name' ||
			field.name === 'ja_date_of_birth' ||
			field.name === 'ja_email' ||
			field.name === 'ja_phone_number' ||
			field.name === 'ja_employment_status' ||
			field.name === 'ja_work_phone' ||
			field.name === 'ja_gross_monthly_income' ||
			field.name === 'ja_current_employer' ||
			field.name === 'ja_job_title' ||
			field.name === 'ja_employer_address' ||
			field.name === 'ja_employer_city' ||
			field.name === 'ja_employer_state' ||
			field.name === 'ja_employer_zip_code' ||
			field.name === 'ja_employer_phone_number' ||
			field.name === 'ja_employed_since' ||
			field.name === 'ja_other_monthly_income' ||
			field.name === 'ja_other_income_sources' ||
			field.name === 'different_residential_address' ||
			field.name === 'ja_social_security_number' ||
			field.name === 'ja_driver_license' ||
			field.name === 'ja_driver_license_state' ||
			field.name === 'ja_employment_info' ||
			field.name === 'ja_employed_since' ||
			field.name === 'ja_other_monthly_income' ||
			field.name === 'ja_other_income_sources' ||
			field.name === 'different_residential_address' ||
			field.name === 'ja_social_security_number' ||
			field.name === 'ja_driver_license' ||
			field.name === 'ja_driver_license_state' ||
			field.name === 'ja_employment_info' ||
			field.name === 'ja_if_under_2_years_at_current_job'
		)
			if (watchAllFields['joint_applicant']) {
				setIsHidden(false);
			} else {
				setIsHidden(true);
			}

		if (
			field.name === 'ja_address' ||
			field.name === 'ja_city' ||
			field.name === 'ja_state' ||
			field.name === 'ja_zip_code' ||
			field.name === 'ja_residence_history' ||
			field.name === 'ja_rent_or_own' ||
			field.name === 'ja_living_here_since' ||
			field.name === 'ja_monthly_payment' ||
			field.name === 'ja_if_at_address_for_less_than_2_years'
		)
			if (watchAllFields['different_residential_address'] && watchAllFields['joint_applicant']) {
				setIsHidden(false);
			} else {
				setIsHidden(true);
			}

		if (
			field.name === 'ja_previous_address' ||
			field.name === 'ja_previous_city' ||
			field.name === 'ja_previous_state' ||
			field.name === 'ja_previous_zip_code' ||
			field.name === 'ja_previous_residence_history' ||
			field.name === 'ja_previous_rent_or_own' ||
			field.name === 'ja_previous_from_date' ||
			field.name === 'ja_previous_to_date' ||
			field.name === 'ja_previous_monthly_payment'

			// ja_previous_address ja_previous_city
		)
			if (
				watchAllFields['different_residential_address'] &&
				watchAllFields['joint_applicant'] &&
				watchAllFields['ja_if_at_address_for_less_than_2_years']
			) {
				setIsHidden(false);
			} else {
				setIsHidden(true);
			}

		if (
			field.name === 'ja_previous_gross_monthly_income' ||
			field.name === 'ja_previous_employer' ||
			field.name === 'ja_previous_job_title' ||
			field.name === 'ja_previous_employer_address' ||
			field.name === 'ja_previous_employer_city' ||
			field.name === 'ja_previous_employer_state' ||
			field.name === 'ja_previous_employer_zip_code' ||
			field.name === 'ja_previous_employer_phone_number' ||
			field.name === 'ja_previous_employed_from_date' ||
			field.name === 'ja_previous_employed_to_date'
		)
			if (watchAllFields['ja_if_under_2_years_at_current_job'] && watchAllFields['joint_applicant']) {
				setIsHidden(false);
			} else {
				setIsHidden(true);
			}
	}, [watchAllFields, field.name]);

	if (isHidden) return;
	return <FieldRenderer field={field} isPending={isPending} setIsTextareaTouched={setIsTextareaTouched} />;
};

export default FormElement;
