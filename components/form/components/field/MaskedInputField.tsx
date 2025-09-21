import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import Label from "./Label";
import ReactInputMask from "react-input-mask";
import { cn } from "@/lib/utils";

type Props = {
  fieldData: any;
  inputMode: string;
  errors?: any;
  pattern?: RegExp;
  patternMessage?: string;
  mask?: string;
};

function MaskedInputField({
  fieldData,
  pattern,
  patternMessage,
  mask,
  inputMode,
  ...rest
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[fieldData.name];

  const validationRules = {
    required: fieldData.is_required,
    ...(pattern && {
      pattern: {
        value: pattern,
        message: patternMessage || "Invalid format",
      },
    }),
  };

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
        rules={validationRules}
        render={({ field }) => (
          <ReactInputMask
            mask={mask || "999-99-9999"}
            maskPlaceholder={null}
            {...field}
            {...rest}
          >
            {(inputProps: any) => (
              <input
                id={fieldData.id}
                placeholder={fieldData.placeholder}
                inputMode={inputMode}
                {...inputProps}
                className={cn("bg-white", hasError ? "border-red-500" : "")}
              />
            )}
          </ReactInputMask>
        )}
      />
    </div>
  );
}

export default MaskedInputField;
