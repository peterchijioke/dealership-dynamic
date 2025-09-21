import React from "react";
import { FormFieldT } from "../../types";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { useFormContext } from "react-hook-form";
import Label from "./Label";

type Props = {
  fieldData: FormFieldT;
};

function RadioField(props: Props) {
  const { fieldData } = props;
  const { watch, setValue } = useFormContext();
  const selectedValue = watch(fieldData.name);

  return (
    <>
      <Label label={fieldData.label} isRequired={fieldData.is_required} />
      <RadixRadioGroup.Root
        className="flex"
        value={selectedValue}
        onValueChange={(val: any) => setValue(fieldData.name, val)}
        name={fieldData.name}
      >
        {fieldData.options?.map((option) => (
          <div className="flex items-center gap-3" key={option.value}>
            <RadixRadioGroup.Item
              value={option.value}
              id={option.value}
              className="w-5 h-5 rounded-full border border-gray-300 bg-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="block w-3 h-3 rounded-full bg-primary opacity-0 data-[state=checked]:opacity-100 transition" />
            </RadixRadioGroup.Item>
            <label className="text-sm" htmlFor={option.value}>
              {option.label}
            </label>
          </div>
        ))}
      </RadixRadioGroup.Root>
    </>
  );
}

export default RadioField;
