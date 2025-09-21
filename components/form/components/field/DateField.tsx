import { Controller, useFormContext } from "react-hook-form";
import Label from "./Label";
import ReactInputMask from "react-input-mask";

import { FormFieldT } from "../../types";
import Input from "./Input";
import { cn } from "@/lib/utils";

type Props = {
  fieldData: FormFieldT;
} & React.InputHTMLAttributes<HTMLInputElement>;

const DateField: React.FC<Props> = (props) => {
  const { fieldData, ...rest } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[fieldData.name];

  const dateValidation = (value?: string): true | string => {
    const datePattern =
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
    if (!value || !value.match(datePattern)) {
      return "Incorrect date format, should be MM/DD/YYYY";
    }

    const [month, day, year] = value.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fieldData.settings?.date_control_mode === "future_mode") {
      if (inputDate <= today) {
        return "Date must be in the future";
      }
    } else if (fieldData.settings?.date_control_mode === "past_mode") {
      if (inputDate > today) {
        return "Date cannot be in the future";
      }
    }
    return true;
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
        defaultValue=""
        rules={{
          // required: fieldData.is_required,
          ...(fieldData.is_required
            ? { required: "This field is required" }
            : {}),
          // validate: dateValidation,
          validate: (value?: string) => {
            // If not required and empty, consider valid
            if (!value) {
              return true;
            }
            // Otherwise run full date validation
            return dateValidation(value);
          },
        }}
        render={({ field }) => {
          const {
            onChange: fieldOnChange,
            onBlur: fieldOnBlur,
            value: fieldValue,
            ref: fieldRef,
            ...fieldRest
          } = field;

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let inputValue = e.target.value;
            const inputElement = e.target;

            let month, day;
            const [_month, _day, _year] = inputValue.split("/");
            month = _month;
            day = _day;
            const year = _year;

            if (month && /^[2-9]$/.test(month)) {
              month = `0${month}`;
              inputValue = `${month}/${day || ""}/${year || ""}`;
              fieldOnChange(inputValue);

              requestAnimationFrame(() => {
                inputElement.setSelectionRange(3, 3);
              });
              return;
            }

            if (month && parseInt(month) > 12) {
              month = "12";
            }

            if (day && parseInt(day) > 31) {
              day = "31";
            }

            inputValue = `${month || ""}/${day || ""}/${year || ""}`;
            fieldOnChange(inputValue);
          };

          return (
            <ReactInputMask
              mask="99/99/9999"
              maskPlaceholder={null}
              value={fieldValue || ""}
              onBlur={fieldOnBlur}
              onChange={handleChange}
              {...fieldRest}
            >
              {(inputProps: any) => (
                <Input
                  {...inputProps}
                  {...rest}
                  ref={fieldRef}
                  placeholder={fieldData.placeholder}
                  type="text"
                  className={cn("bg-white", hasError ? "border-red-500" : "")}
                />
              )}
            </ReactInputMask>
          );
        }}
      />
    </div>
  );
};

export default DateField;
