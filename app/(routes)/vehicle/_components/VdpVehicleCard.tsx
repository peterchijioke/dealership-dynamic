import React, { Fragment, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useVehicleDetails } from "./VdpContextProvider";
import { cn } from "@/lib/utils";
import { formatPrice, stripTrailingCents } from "@/utils/utils";
import { toast } from "sonner";

// Type definitions matching the context
interface ButtonStyles {
  [key: string]: string | number;
}

interface CTAButton {
  device: string;
  cta_type: "html" | "button" | "link" | "form";
  cta_label: string;
  btn_styles: ButtonStyles;
  btn_classes: string[];
  btn_content: string;
  open_newtab: boolean;
  cta_location: string;
  btn_attributes: Record<string, any>;
}

export interface VdpContextType {
  footerInView: boolean;
  vdpData: {
    title?: string;
    sale_price?: number;
    prices?: {
      dealer_sale_price_formatted?: string;
    };
    mileage?: number | string;
    vin_number?: string;
    stock_number?: string;
    dealer_city?: string;
    dealer_state?: string;
    dealer_zip_code?: string;
    dealer_domain?: string;
    carfax_url?: string;
    carfax_icon_url?: string;
    cta: CTAButton[];
  };
}

interface FormField {
  field_type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "hidden"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "paragraph";
  name: string;
  label: string | null;
  tooltip: string;
  default_value: string | null;
  is_visible: boolean;
  classes: string | null;
  placeholder: string;
  is_required: boolean;
  options: Array<{ label: string; value: string }> | null;
  settings: {
    display_grid?: string;
    vehicle?: boolean;
    tag_name?: string;
    date_control_mode?: string;
  };
}

interface FormData {
  title: string;
  tags: string | null;
  id: string;
  fields: FormField[];
}

interface FormApiResponse {
  success: boolean;
  data: FormData;
}

interface FormSubmitResponse {
  success: boolean;
  data: boolean;
}

// Extended button type for internal use
interface ButtonDataWithFormHandler extends CTAButton {
  onFormClick?: (formId: string) => void;
}

// Inline Form Component - Simplified without accordion
const InlineForm: React.FC<{
  formId: string;
  dealerDomain: string;
  onBack: () => void;
}> = ({ formId, dealerDomain, onBack }) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (formId) {
      fetchFormData();
    }
  }, [formId]);

  const fetchFormData = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://dealertower.app/api/${dealerDomain}/form/${formId}`
      );
      const data: FormApiResponse = await response.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Error fetching form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: string): void => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `https://api.dealertower.com/public/${dealerDomain}/v1/form/${formId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const result: FormSubmitResponse = await response.json();
        console.log("Form submitted successfully:", result);

        if (result.success && result.data) {
          toast.success("Form submitted successfully!", {
            description:
              "Thank you for your submission. We'll get back to you soon.",
            duration: 4000,
          });

          setTimeout(() => {
            onBack();
          }, 1500);
        } else {
          toast.error("Form submission failed", {
            description: "Please check your information and try again.",
          });
        }
      } else {
        const errorData = await response.json();
        console.error("Form submission failed:", errorData);

        toast.error("Form submission failed", {
          description: errorData.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField): React.ReactNode => {
    const gridClass =
      field.settings?.display_grid === "12"
        ? "col-span-12"
        : field.settings?.display_grid === "6"
        ? "col-span-6"
        : field.settings?.display_grid === "4"
        ? "col-span-4"
        : "col-span-12";
    const isRequired = field.is_required;

    if (!field.is_visible) return null;

    switch (field.field_type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div key={field.name} className={gridClass}>
            <input
              type={field.field_type}
              name={field.name}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required={isRequired}
              defaultValue={field.default_value || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={submitting}
            />
          </div>
        );

      case "date":
        return (
          <div key={field.name} className={gridClass}>
            <input
              type="date"
              name={field.name}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required={isRequired}
              defaultValue={field.default_value || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={submitting}
            />
          </div>
        );

      case "select":
        return (
          <div key={field.name} className={gridClass}>
            <div className="relative">
              <select
                name={field.name}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                required={isRequired}
                defaultValue={field.default_value || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                disabled={submitting}
              >
                <option value="">
                  Select {field.label}
                  {isRequired ? "*" : ""}
                </option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className={gridClass}>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-gray-700 mb-3">
                {field.label}
                {isRequired ? "*" : ""}
              </legend>
              <div className="flex flex-wrap gap-4">
                {field.options?.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      required={isRequired}
                      defaultChecked={field.default_value === option.value}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      disabled={submitting}
                    />
                    <span className="text-gray-700 capitalize">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className={gridClass}>
            <label className="flex items-start space-x-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input
                type="checkbox"
                name={field.name}
                value="true"
                className="w-4 h-4 mt-0.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                required={isRequired}
                defaultChecked={field.default_value === "true"}
                onChange={(e) =>
                  handleInputChange(
                    field.name,
                    e.target.checked ? "true" : "false"
                  )
                }
                disabled={submitting}
              />
              <span className="text-gray-700 leading-relaxed">
                {field.label}
                {isRequired ? "*" : ""}
              </span>
            </label>
          </div>
        );

      case "paragraph":
        const tagName =
          (field.settings?.tag_name as keyof JSX.IntrinsicElements) || "p";

        return (
          <div key={field.name} className={gridClass}>
            {React.createElement(
              tagName,
              {
                className: cn(
                  "text-gray-800",
                  tagName === "h2" &&
                    "text-lg font-semibold mt-6 mb-3 text-gray-900 border-b border-gray-200 pb-2",
                  tagName === "p" &&
                    "text-xs text-gray-600 mb-4 leading-relaxed bg-gray-50 p-3 rounded-lg"
                ),
              },
              field.default_value
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className={gridClass}>
            <textarea
              name={field.name}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200"
              required={isRequired}
              defaultValue={field.default_value || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={submitting}
            />
          </div>
        );

      case "hidden":
        return (
          <input
            key={field.name}
            type="hidden"
            name={field.name}
            value={field.default_value || ""}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
          disabled={submitting}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 flex-1">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-3 text-center text-sm">
            Loading form...
          </p>
        </div>
      ) : formData ? (
        <div className="flex flex-col h-full min-h-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">
            {formData.title}
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-12 gap-3">
                {formData.fields.map((field) => renderField(field))}
              </div>

              <div className="pt-4 mt-6 border-t bg-white sticky bottom-0">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 flex-1">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Error Loading Form
          </h3>
          <p className="text-gray-600 text-center mb-3 text-xs">
            We couldn&apos;t load the form. Please try again.
          </p>
          <button
            onClick={() => fetchFormData()}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-xs"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default function VdpVehicleCard(): JSX.Element {
  const { footerInView, vdpData } = useVehicleDetails() as VdpContextType;
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showCtaButtons, setShowCtaButtons] = useState<boolean>(false);
  const handleFormCTA = (formId: string): void => {
    setSelectedFormId(formId);
    setShowForm(true);
  };

  const handleBackToCard = (): void => {
    setShowForm(false);
    setSelectedFormId(null);
  };

  return (
    <>
      <div className="hidden md:block md:relative flex-auto">
        <div
          style={{
            position: !footerInView ? "fixed" : "sticky",
            minHeight: "auto",
            maxHeight: "calc(-72px + 100vh)",
            bottom: "unset",
            top: "unset",
          }}
          className="max-h-[calc(100vh-62px)]  overflow-y-auto bg-white  rounded-3xl min-h-[420px] p-6 w-full shadow-xs md:mt-10 pb-6x max-w-sm"
        >
          <div>
            {/* Price section - always visible */}
            <div className="flex flex-row gap-1 justify-between mb-6">
              <div className="flex flex-col">
                <div className="font-bold text-xl inline-block !text-[20px] ">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {vdpData?.title}
                  </h1>
                </div>
                <div className="inline-block text-lg">
                  <h2></h2>
                </div>
              </div>
              <div className="flex flex-col items-end ">
                <div className=" text-rose-700 font-bold text-2xl">
                  <h2>
                    {vdpData.sale_price != null
                      ? formatPrice(vdpData.sale_price)
                      : stripTrailingCents(
                          vdpData.prices?.dealer_sale_price_formatted
                        )}
                  </h2>
                </div>
                <div className="flex flex-row min-w-max">
                  <button className="hidden md:block rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Price Details
                  </button>
                </div>
              </div>
            </div>

            {!showForm ? (
              <Fragment>
                <div className={"hidden md:flex flex-col gap-y-3 mb-6"}>
                  <div className="flex flex-row justify-between">
                    <span className="font-semibold">Mileage</span>
                    <span>{vdpData?.mileage} mi</span>
                  </div>

                  <div className="flex justify-between">
                    <span className=" font-semibold ">VIN #</span>
                    <span>{vdpData?.vin_number}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold ">Stock #</span>
                    <span>{vdpData?.stock_number}</span>
                  </div>
                </div>

                <div className=" hidden md:block py-2">
                  {vdpData.cta?.map((ctaItem, index) => (
                    <div key={index} className="flex items-center  w-full py-1">
                      {getButtonType({
                        ...ctaItem,
                        onFormClick: handleFormCTA,
                      })}
                    </div>
                  ))}

                  {/* {!showCtaButtons && (
                    <button
                      onClick={() => {
                        setShowCtaButtons(!showCtaButtons);
                      }}
                      className=" bg-rose-700 cursor-pointer text-white active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full border-0 pl-0 pr-1 mr-4 border-transparent hover:text-primary-600 text-primary-500 mb-2 w-full border-none flex flex-row items-start justify-center"
                      aria-haspopup="false"
                    >
                      <div className="w-full text-[0.96rem]">
                        I&apos;m Interested
                      </div>
                    </button>
                  )} */}
                </div>

                <div className=" flex-row flex items-center">
                  {vdpData?.carfax_url && (
                    <a
                      className=" w-full "
                      href={vdpData?.carfax_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className=" aspect-square size-20"
                        src={vdpData?.carfax_icon_url}
                        alt="carfax"
                      />
                    </a>
                  )}
                </div>
              </Fragment>
            ) : (
              selectedFormId && (
                <InlineForm
                  formId={selectedFormId}
                  dealerDomain={
                    vdpData?.dealer_domain || "www.nissanofportland.com"
                  }
                  onBack={handleBackToCard}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getButtonType = (data: ButtonDataWithFormHandler): JSX.Element => {
  const {
    btn_content,
    cta_label,
    cta_type,
    open_newtab = false,
    btn_classes = [],
    btn_attributes = {},
    onFormClick,
  } = data;

  const baseButtonClasses =
    "active:opacity-90 bg-rose-700 cursor-pointer select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full bg-primary-500 hover:bg-primary-600 hover:border-primary-600 text-white border-primary-500 w-full ";

  // Handle form type - show inline form
  if (cta_type === "form" && onFormClick) {
    return (
      <button
        type="button"
        className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
        onClick={() => onFormClick(btn_content)}
        aria-haspopup="false"
        {...btn_attributes}
      >
        {cta_label}
      </button>
    );
  }

  // Handle HTML content type
  if (cta_type === "html" && btn_content) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: btn_content }}
        className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
        aria-haspopup="false"
        {...btn_attributes}
      />
    );
  }

  // Handle link type
  if (cta_type === "link" && btn_content) {
    return (
      <a
        href={btn_content}
        className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
        target={open_newtab ? "_blank" : "_self"}
        rel={open_newtab ? "noopener noreferrer" : undefined}
        aria-haspopup="false"
        {...btn_attributes}
      >
        {cta_label}
      </a>
    );
  }

  // Default button type
  return (
    <button
      type="button"
      className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
      aria-haspopup="false"
      {...btn_attributes}
    >
      {cta_label}
    </button>
  );
};
