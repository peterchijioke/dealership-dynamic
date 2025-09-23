"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVehicleDetails } from "./VdpContextProvider";
import AvailabilityForm from "./AvailabilityForm";
import FeaturesMobile from "./FeaturesMobile";
import { VdpContextType } from "./VdpVehicleCard";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getFormField, submitForm } from "@/app/api/dynamic-forms";
import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";
import { useRouter } from "next/navigation";

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
  onClose: () => void;
}> = ({ formId, dealerDomain, onBack, onClose }) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  React.useEffect(() => {
    if (formId) {
      fetchFormData();
    }
  }, [formId]);

  const fetchFormData = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await getFormField(formId, dealerDomain);

      if (result.success && result.data) {
        setFormData(result.data);
      }
    } catch (error) {
      console.error("Error fetching form:", error);
    } finally {
      setLoading(false);
    }
  };

  // Build Zod schema from formData.fields
  const schema = useMemo(() => {
    if (!formData) return z.object({});
    const shape: Record<string, any> = {};
    for (const field of formData.fields) {
      if (!field.is_visible) continue;
      let zodType: any = z.string();
      if (field.field_type === "email")
        zodType = z.string().email("Invalid email");
      if (field.field_type === "tel")
        zodType = z.string().min(7, "Invalid phone number");
      if (field.field_type === "date") zodType = z.string();
      if (field.field_type === "select" || field.field_type === "radio") {
        zodType = z.string();
      }
      if (field.field_type === "checkbox") {
        zodType = z.union([z.literal("true"), z.literal("false")]);
      }
      if (field.is_required) {
        zodType = zodType.min(1, `${field.label || field.name} is required`);
      } else {
        zodType = zodType.optional();
      }
      shape[field.name] = zodType;
    }
    return z.object(shape);
  }, [formData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  // Reset form when formData changes
  useEffect(() => {
    if (formData) {
      const defaults: Record<string, any> = {};
      for (const field of formData.fields) {
        if (field.default_value !== null && field.default_value !== undefined) {
          defaults[field.name] = field.default_value;
        }
      }
      reset(defaults);
    }
  }, [formData, reset]);

  const onSubmit = async (data: Record<string, string>) => {
    setSubmitting(true);
    try {
      const result = await submitForm(data, formId, dealerDomain);
      if (result.success && result.data) {
        toast.success("Form submitted successfully!", {
          description:
            "Thank you for your submission. We'll get back to you soon.",
          duration: 4000,
        });
        setTimeout(() => {
          onBack();
        }, 1500);
      }
    } catch (error) {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField): React.ReactNode => {
    const gridClass = "col-span-12";
    const isRequired = field.is_required;
    if (!field.is_visible) return null;
    // Show error if present
    const error = errors[field.name]?.message as string | undefined;
    switch (field.field_type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div key={field.name} className={gridClass}>
            <input
              type={field.field_type}
              {...register(field.name)}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              disabled={submitting}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        );
      case "date":
        return (
          <div key={field.name} className={gridClass}>
            <input
              type="date"
              {...register(field.name)}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              disabled={submitting}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        );
      case "select":
        return (
          <div key={field.name} className={gridClass}>
            <select
              {...register(field.name)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
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
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
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
                      value={option.value}
                      {...register(field.name)}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      disabled={submitting}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        );
      case "checkbox":
        return (
          <div key={field.name} className={gridClass}>
            <label className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                {...register(field.name)}
                value="true"
                className="w-4 h-4 mt-0.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                disabled={submitting}
              />
              <span className="text-gray-700">
                {field.label}
                {isRequired ? "*" : ""}
              </span>
            </label>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
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
              {...register(field.name)}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none transition-all duration-200"
              disabled={submitting}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        );
      case "hidden":
        return (
          <input
            key={field.name}
            type="hidden"
            {...register(field.name)}
            value={field.default_value || ""}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 h-full pt-8 w-full flex flex-col">
      <div className=" w-full flex-shrink-0 flex justify-end px-3 ">
        <button
          onClick={onClose}
          className="flex rounded-full w-fit items-center justify-center bg-gray-300 p-2 gap-3 text-gray-600 hover:text-gray-600  transition-colors duration-200 text-sm"
          disabled={submitting}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 flex-1">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-3 text-center text-sm">
                Loading form...
              </p>
            </div>
          ) : formData ? (
            <div className="flex flex-col h-full gap-4 min-h-0 px-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">
                {formData.title}
              </h2>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-12 gap-5 pt-4 px-1">
                  {formData.fields.map((field) => renderField(field))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 flex-1">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-4 h-4 text-rose-700"
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
                className="px-3 py-1.5 bg-rose-700 text-white rounded-md hover:bg-rose-700 transition-colors duration-200 text-xs"
              >
                Retry
              </button>
            </div>
          )}
        </div>
        <div className="w-full flex  items-center gap-2 px-4 ">
          <button
            onClick={onBack}
            className="flex rounded-full w-fit items-center py-3 px-3 justify-center gap-3 text-white hover:text-white bg-rose-700 transition-colors duration-200 text-sm"
            disabled={submitting}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          {formData && (
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-rose-700 flex-1 rounded-full text-white py-3 font-semibold text-sm hover:bg-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
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
  const bottomInView = (useVehicleDetails() as any).bottomInView;

  // Lock body scroll while sheet is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);
  const { site } = useGetCurrentSite();

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
  const route = useRouter();
  return (
    <div ref={footerRef} className="relative">
      {/* Bottom gradient under the pill (mobile only) */}
      {/* <div className="md:hidden pointer-events-none fixed inset-x-0 bottom-0 h-fit bg-gradient-to-t from-white to-transparent z-10" /> */}

      {!open && (
        <div className="md:hidden fixed  left-0 right-0 bottom-6 z-30 px-4 ">
          {!featureInView && !bottomInView && (
            <div className="w-full flex  items-center gap-1">
              <button
                onClick={() => {
                  route.back();
                }}
                className="flex rounded-full w-fit items-center py-3 px-3 justify-center gap-3 text-white hover:text-white bg-rose-700 transition-colors duration-200 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full py-3 flex-1  rounded-full font-semibold text-white
                       bg-rose-700 hover:bg-rose-800
"
              >
                I&apos;m Interested
              </button>
            </div>
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
      {/* <div
        onClick={handleBackdropClick}
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px]
                    transition-opacity duration-200
                    ${
                      open
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
        aria-hidden={!open}
      /> */}

      {/* Bottom Sheet */}
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={`md:hidden fixed h-full w-full   bottom-0 grid z-[1000]
                    transform transition-transform duration-300
                    ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div
          className=" pb-3 h-full flex-1 bg-white shadow-2xl
                          overflow-hidden flex flex-col"
        >
          {showForm && selectedFormId ? (
            <MobileInlineForm
              onClose={handleCloseSheet}
              formId={selectedFormId}
              dealerDomain={site}
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

              <div className="flex items-center  gap-2 px-3 mt-auto">
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
