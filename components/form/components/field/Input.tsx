import React from "react";
import { FormFieldT } from "../../types";
import Label from "./Label";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type Props = {
  fieldData: FormFieldT;
  // validate?: Validate<any, any>;
  // Accept a validation function returning boolean or string
  validate?: (value: string) => boolean | string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function InputField(props: Props) {
  const { fieldData, validate, ...rest } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[fieldData.name];

  return (
    <div className="relative">
      <Label
        label={fieldData.label}
        isRequired={fieldData.is_required}
        className="absolute -top-2.5 left-2 z-10 bg-white px-1"
      />
      <input
        {...register(fieldData.name, {
          // required: fieldData.is_required,
          // validate: validate,
          // Only enforce required when fieldData.is_required is true
          ...(fieldData.is_required
            ? { required: "This field is required" }
            : {}),
          // Wrap the validate function to allow empty values for optional fields
          validate: (value: any) => {
            // Skip validation for optional empty fields
            if (!fieldData.is_required && !value) {
              return true;
            }
            // If no validate prop, always valid
            if (!validate) {
              return true;
            }
            // Run the provided validation function
            const result = validate(value);
            // If it returns true, pass; if it returns string or false, return error message
            return result === true
              ? true
              : typeof result === "string"
              ? result
              : "Invalid value";
          },
        })}
        placeholder={fieldData.placeholder}
        {...rest}
        className={cn("bg-white", hasError ? "border-red-500" : "")}
      />
    </div>
  );
}

export default InputField;
