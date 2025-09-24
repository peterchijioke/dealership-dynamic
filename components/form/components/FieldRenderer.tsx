import * as RadixTooltip from "@radix-ui/react-tooltip";
import React from "react";
import { FormFieldT } from "../types";
import InputField from "./field/Input";
import { validateEmail } from "../validations";
import TelInputField from "./field/TelInput";
import TextAreaField from "./field/TextArea";
import CheckboxField from "./field/Checkbox";
import RadioField from "./field/Radio";
import SubmitButton from "./field/Submit";
import SelectField from "./field/Select";
import DateField from "./field/DateField";
import MaskedInputField from "./field/MaskedInputField";
import { useFormContext } from "react-hook-form";
import FileInput from "./field/FileInput";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { cn } from "@/lib/utils";

type Props = {
  field: FormFieldT;
  isPending: boolean;
  setIsTextareaTouched?: React.Dispatch<React.SetStateAction<boolean>>;
};

function FieldRenderer(props: Props) {
  const { field, isPending, setIsTextareaTouched } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isMobile = useIsSmallScreen(768);

  const defaultColSpan = +(
    field.display_grid ??
    field.settings?.display_grid ??
    12
  );
  const colSpan = isMobile ? 12 : defaultColSpan;
  const tagName = field.settings?.tag_name;

  const FieldView = () => {
    switch (field.field_type) {
      case "text":
        if (field.name === "social_security_number") {
          return (
            <MaskedInputField
              fieldData={field}
              pattern={/^\d{3}-\d{2}-\d{4}$/}
              mask="999-99-9999"
              patternMessage="Invalid Social Security Number format"
              inputMode="numeric"
            />
          );
        }
        if (field.settings?.vin_number) {
          return (
            <MaskedInputField
              fieldData={field}
              pattern={/^[A-HJ-NPR-Z0-9]{17}$/}
              mask="*****************"
              patternMessage="Invalid VIN format. Please enter a valid 17-character VIN."
              inputMode="text"
            />
          );
        }
        return <InputField fieldData={field} />;

      case "email":
        return <InputField fieldData={field} validate={validateEmail} />;

      case "tel":
        return <TelInputField fieldData={field} />;

      case "textarea":
        return (
          <TextAreaField
            fieldData={field}
            setIsTouched={setIsTextareaTouched}
          />
        );

      case "time":
        return <InputField fieldData={field} type="time" />;

      case "checkbox":
        return <CheckboxField fieldData={field} />;

      case "radio":
        return <RadioField fieldData={field} />;

      case "submit":
        return <SubmitButton fieldData={field} isPending={isPending} />;

      case "select":
        return <SelectField fieldData={field} />;

      case "date":
        return <DateField fieldData={field} />;

      case "paragraph": {
        const ParagraphTag: any = tagName
          ? (tagName as keyof JSX.IntrinsicElements)
          : "p";
        const paragraphClass =
          ParagraphTag === "h2" ||
          ParagraphTag === "h3" ||
          ParagraphTag === "h4" ||
          ParagraphTag === "h5" ||
          ParagraphTag === "h6"
            ? "text-center text-h4"
            : "text-body-2";
        return (
          <ParagraphTag className={cn(paragraphClass)}>
            {field.label || field.default_value}
          </ParagraphTag>
        );
      }
      case "file":
        return (
          <FileInput
            name={field.name}
            label={field.label}
            isRequired={field.is_required}
            register={register}
            errors={errors}
            rules={{ required: field.is_required }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <RadixTooltip.Root delayDuration={200} open={!!field.tooltip}>
      <RadixTooltip.Trigger asChild>
        <div style={{ gridColumn: `span ${colSpan}/span ${colSpan}` }}>
          {FieldView()}
        </div>
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className="z-50 rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
          sideOffset={5}
        >
          {field.tooltip}
          <RadixTooltip.Arrow className="fill-black" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

export default FieldRenderer;
