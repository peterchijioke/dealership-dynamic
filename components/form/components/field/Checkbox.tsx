import React, { useEffect, useState } from 'react';
import { FormFieldT } from '../../types';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { useFormContext } from 'react-hook-form';

type Props = {
	fieldData: FormFieldT;
};

function CheckboxField(props: Props) {
	const { fieldData } = props;

	const [isAdditionalLabel, setIsAdditionalLabel] = useState<boolean>(false);

	useEffect(() => {
		if (fieldData.name === 'agree') {
			setIsAdditionalLabel(true);
		} else {
			setIsAdditionalLabel(false);
		}
		// }
	}, [fieldData.name]);

	const { register } = useFormContext();

		return (
			<div className="flex items-center gap-2">
				<RadixCheckbox.Root
					id={fieldData.id}
					className="w-5 h-5 rounded border border-gray-300 bg-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
					{...register(fieldData.name)}
				>
					<RadixCheckbox.Indicator>
						<CheckIcon className="w-4 h-4 text-primary" />
					</RadixCheckbox.Indicator>
				</RadixCheckbox.Root>
				<label htmlFor={fieldData.id} className="text-sm select-none">
					{fieldData.label}
					{isAdditionalLabel && (
						<span className="ml-1 text-xs text-gray-500">(Additional)</span>
					)}
				</label>
			</div>
		);
}

export default CheckboxField;
