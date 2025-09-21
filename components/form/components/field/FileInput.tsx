import React, { useState } from 'react';

type FileInputProps = {
	name: string;
	label?: string;
	isRequired?: boolean;
	register: ReturnType<typeof import('react-hook-form').useFormContext>['register'];
	errors?: any;
	rules?: object;
	icon?: React.ReactNode;
	acceptedFileTypes?: string;
};

const FileInput: React.FC<FileInputProps> = ({
	name,
	label,
	isRequired,
	register,
	errors,
	rules,
	icon,
	acceptedFileTypes = 'application/pdf, application/msword',
}) => {
	const [fileName, setFileName] = useState<string | null>(null);

	const handleRemoveFile = () => {
		setFileName(null);
		const inputElement = document.getElementById(name) as HTMLInputElement | null;
		if (inputElement) inputElement.value = '';
	};

	return (
		<div className="relative flex w-full flex-col">
			<input
				type="file"
				id={name}
				accept={acceptedFileTypes}
				{...register(name, {
					...rules,
					onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
						const file = e.target.files?.[0];
						setFileName(file ? file.name : null);
					},
				})}
				className={`h-12 w-full border py-2 pl-[100px] pr-4 ${
					errors?.[name] ? 'border-red-500' : 'border-gray-300'
				} focus:ring-blue-500 rounded focus:outline-none focus:ring-2`}
			/>
			{fileName && (
				<div className="absolute left-[210px] top-3 flex items-center space-x-2 bg-white px-2">
					<span className="text-sm text-gray-700">{fileName}</span>
					<button type="button" onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
						&times;
					</button>
				</div>
			)}
			{label && (
				<label
					htmlFor={name}
					className={`pointer-events-none absolute left-4 top-3 bg-white px-1 text-sm transition-all
						${errors?.[name] ? 'text-red-500' : 'text-gray-500'}`}
				>
					{label}
					{isRequired && <span className="text-red-500">*</span>}
				</label>
			)}
			{icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer">{icon}</div>}
		</div>
	);
};

export default FileInput;
