import * as RadixSlot from "@radix-ui/react-slot";
import React from "react";
import { FormFieldT } from "../../types";
import Label from "./Label";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type Props = {
  fieldData: FormFieldT;
  setIsTouched?: React.Dispatch<React.SetStateAction<boolean>>;
};

function TextAreaField(props: Props) {
  const { fieldData, setIsTouched } = props;

  const {
    register,
    control,
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
      <Controller
        name={fieldData.name}
        control={control}
        rules={{ required: fieldData.is_required }}
        render={({ field }) => (
          <RadixSlot.Slot>
            <textarea
              {...field}
              placeholder={fieldData.placeholder}
              rows={4}
              onChange={(e) => {
                if (setIsTouched) setIsTouched(true);
                field.onChange(e);
              }}
              className={cn(
                "block w-full rounded border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary",
                hasError ? "border-red-500" : ""
              )}
            />
          </RadixSlot.Slot>
        )}
      />
      {/* <Textarea
				{...register(fieldData.name, {
					required: fieldData.is_required,
				})}
				placeholder={fieldData.placeholder}
				rows={4}
				className={classnames('bg-white', hasError ? 'border-red-500' : '')}
			/> */}
    </div>
  );
}

export default TextAreaField;
