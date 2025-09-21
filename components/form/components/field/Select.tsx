import React, { useEffect } from "react";
import { FormFieldT, InventoryFieldResponse } from "../../types";
import Label from "./Label";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { getInventoryFields } from "../../apis";

import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";

type Props = {
  fieldData: FormFieldT;
};

function SelectField(props: Props) {
  const { fieldData } = props;

  const { site } = useGetCurrentSite();

  const { control } = useFormContext();

  const inventoryFieldName = fieldData.settings.value?.replace("kbb_", "");
  const isKBBField = fieldData.settings.value?.includes("kbb");

  let queryParams: Record<string, any> = {};
  let queryKey: any[] = [];
  let shouldFetchInventoryOptions = false;

  const [yearValue, makeValue, modelValue] = useWatch({
    control,
    name: ["year", "make", "model"],
  });
  const yearValueSingle = useWatch({ control, name: "year" });

  if (inventoryFieldName === "trim") {
    queryParams = {
      year: yearValue,
      make: makeValue,
      model: modelValue,
    };
    shouldFetchInventoryOptions = !!yearValue && !!makeValue && !!modelValue;
    queryKey = [
      "select-options",
      fieldData.id,
      yearValue,
      makeValue,
      modelValue,
    ];
  } else if (inventoryFieldName === "model") {
    queryParams = {
      year: yearValue,
      make: makeValue,
    };
    shouldFetchInventoryOptions = !!yearValue && !!makeValue;
    queryKey = ["select-options", fieldData.id, yearValue, makeValue];
  } else if (inventoryFieldName === "make") {
    queryParams = { year: yearValue };
    shouldFetchInventoryOptions = !!yearValueSingle;
    queryKey = ["select-options", fieldData.id, yearValueSingle];
  } else {
    queryParams = { [inventoryFieldName!]: null };
    shouldFetchInventoryOptions = !!inventoryFieldName;
    queryKey = ["select-options", fieldData.id];
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<InventoryFieldResponse | undefined>(
    undefined
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!shouldFetchInventoryOptions) return;
      setIsLoading(true);
      try {
        const result = await getInventoryFields(site, {
          ...queryParams,
          is_kbb: isKBBField,
        });
        if (isMounted) setData(result);
      } catch (error) {
        console.error("Error fetching inventory fields:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [shouldFetchInventoryOptions]);

  const options = shouldFetchInventoryOptions
    ? data?.[inventoryFieldName as string] || []
    : fieldData.options || [];

  // No customStyles needed for Radix

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
        render={({ field }) => (
          <RadixSelect.Root
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={isLoading}
          >
            <RadixSelect.Trigger
              className="flex h-12 w-full items-center justify-between rounded border border-gray-300 bg-white px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={fieldData.label}
            >
              <RadixSelect.Value
                placeholder={fieldData.placeholder || "Select..."}
              />
              <RadixSelect.Icon>
                <ChevronDownIcon />
              </RadixSelect.Icon>
            </RadixSelect.Trigger>
            <RadixSelect.Portal>
              <RadixSelect.Content className="z-50 rounded border border-gray-200 bg-white shadow-lg">
                <RadixSelect.Viewport className="p-1">
                  {options.map((option: any) => (
                    <RadixSelect.Item
                      key={option.value}
                      value={option.value}
                      className="flex cursor-pointer select-none items-center rounded px-2 py-2 text-base text-gray-900 outline-none focus:bg-primary/10"
                    >
                      <RadixSelect.ItemText>
                        {option.label}
                      </RadixSelect.ItemText>
                    </RadixSelect.Item>
                  ))}
                </RadixSelect.Viewport>
              </RadixSelect.Content>
            </RadixSelect.Portal>
          </RadixSelect.Root>
        )}
        rules={{
          required: fieldData.is_required,
        }}
      />
    </div>
  );
}

export default SelectField;
