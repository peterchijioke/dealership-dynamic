"use client";

import React, { useEffect, useRef, useState } from "react";
import { useVehicleDetails } from "./VdpContextProvider";
import AvailabilityForm from "./AvailabilityForm";
import FeaturesMobile from "./FeaturesMobile";
import { VdpContextType } from "./VdpVehicleCard";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  onContinue?: (action: Action) => void; // optional callback
  footerRef: React.RefObject<HTMLDivElement | null>;
};

export type Action =
  | "confirmAvailability"
  | "testDrive"
  | "explorePayments"
  | "valueMyTrade";

// Form interfaces
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

// Mobile Form Component
const MobileInlineForm: React.FC<{
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
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
            <select
              name={field.name}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              required={isRequired}
              defaultValue={field.default_value || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={submitting}
            >
              <option value="">
                {field.label}
                {isRequired ? "*" : ""}
              </option>
              {field.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className={gridClass}>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {isRequired ? "*" : ""}
              </legend>
              <div className="flex flex-wrap gap-4">
                {field.options?.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 text-sm"
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
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className={gridClass}>
            <label className="flex items-start space-x-2 text-sm">
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
              <span className="text-gray-700">
                {field.label}
                {isRequired ? "*" : ""}
              </span>
            </label>
          </div>
        );

      case "paragraph":
        const TagName =
          (field.settings?.tag_name as keyof JSX.IntrinsicElements) || "p";
        return (
          <div key={field.name} className={gridClass}>
            {React.createElement(
              TagName,
              {
                className: cn(
                  "text-gray-800",
                  field.settings?.tag_name === "h2" &&
                    "text-lg font-semibold mb-4 mt-6 first:mt-0",
                  field.settings?.tag_name === "p" &&
                    "text-sm text-gray-600 mb-4"
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none transition-all duration-200"
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
    <div className="bg-gray-50 h-96 pt-4 w-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b mx-4 flex-shrink-0">
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
        <div className="flex flex-col h-full min-h-0 px-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">
            {formData.title}
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-12 gap-3">
                {formData.fields.map((field) => renderField(field))}
              </div>

              <div className="pt-4 mt-6 border-t bg-gray-50 sticky bottom-0">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 text-white py-2.5 rounded-md font-semibold text-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
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
            We couldn't load the form. Please try again.
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

export default function BottomSection({ onContinue, footerRef }: Props) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<Action>("confirmAvailability");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const { vdpData } = useVehicleDetails() as VdpContextType;
  const featureInView = (useVehicleDetails() as any).featureInView;

  // Lock body scroll while sheet is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  const handleContinue = () => {
    // Find the selected CTA item
    const selectedCTA = vdpData.cta?.find((cta) => cta.btn_content === action);

    if (selectedCTA && selectedCTA.cta_type === "form") {
      // If it's a form CTA, show the form
      setSelectedFormId(selectedCTA.btn_content);
      setShowForm(true);
    } else {
      // Otherwise, handle normally
      onContinue?.(action);
      console.log("Continue with:", action);
      setOpen(false);
    }
  };

  const handleBackToSheet = () => {
    setShowForm(false);
    setSelectedFormId(null);
  };

  const handleCloseSheet = () => {
    setOpen(false);
    setShowForm(false);
    setSelectedFormId(null);
  };

  return (
    <div ref={footerRef}>
      {/* Bottom gradient under the pill (mobile only) */}
      <div className="md:hidden pointer-events-none fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      {!open && (
        <div className="md:hidden fixed inset-x-4 bottom-6 z-30">
          {!featureInView && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full py-3 rounded-full font-semibold text-white
                       bg-rose-700 hover:bg-rose-800 active:scale-[.99]
                       shadow-lg transition"
            >
              I&apos;m Interested
            </button>
          )}
          {featureInView && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full py-3 rounded-full font-semibold text-white
                       bg-rose-700 hover:bg-rose-800 active:scale-[.99]
                       shadow-lg transition"
            >
              All features
            </button>
          )}
        </div>
      )}

      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px]
                    transition-opacity duration-200
                    ${
                      open
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
        aria-hidden={!open}
      />

      {/* Bottom Sheet */}
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 grid
                    transform transition-transform duration-300
                    ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div
          className=" pb-3 rounded-t-3xl bg-white shadow-2xl ring-1 ring-black/5
                        max-h-[85vh] overflow-hidden flex flex-col"
        >
          {showForm && selectedFormId ? (
            <MobileInlineForm
              formId={selectedFormId}
              dealerDomain={
                vdpData?.dealer_domain || "www.nissanofportland.com"
              }
              onBack={handleBackToSheet}
            />
          ) : (
            <>
              {!featureInView && (
                <AvailabilityForm action={action} setAction={setAction} />
              )}
              {featureInView && (
                <FeaturesMobile action={action} setAction={setAction} />
              )}

              <div className="flex items-center gap-2 px-3 mt-auto">
                <button
                  type="button"
                  onClick={handleCloseSheet}
                  className=" w-fit px-6  border-primary h-12 rounded-full font-semibold
                             border-2 border-rose-600 text-rose-700
                             bg-white active:scale-[.99]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="f flex-1 py-3 rounded-full font-semibold 
                             bg-rose-600 hover:bg-rose-700 active:scale-[.99]
                             shadow-md bg-rose-700 outline-rose-700 text-white"
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
