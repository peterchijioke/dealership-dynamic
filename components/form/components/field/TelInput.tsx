import React from "react";
import { FormFieldT } from "../../types";
import Label from "./Label";
import { useFormContext } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import classNames from "classnames";
import Input from "./Input";

type Props = {
  fieldData: FormFieldT;
};

function TelInputField(props: Props) {
  const { fieldData } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const registerWithMask = useHookFormMask(register);

  const hasError = !!errors[fieldData.name];

  return (
    <div className="relative">
      <Label
        label={fieldData.label}
        isRequired={fieldData.is_required}
        className="absolute -top-2.5 left-2 z-10 bg-white px-1"
      />
      <input
        {...registerWithMask(fieldData.name, ["999-999-9999"], {
          required: fieldData.is_required,
        })}
        placeholder={fieldData.placeholder}
        className={classNames("bg-white", hasError ? "border-red-500" : "")}
      />
    </div>
  );
}

export default TelInputField;
