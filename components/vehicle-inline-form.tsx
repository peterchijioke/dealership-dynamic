import React from "react";
import type { Vehicle } from "@/types/vehicle";
import { getFormField, submitForm } from "@/app/api/dynamic-forms";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";
import { PLACEHOLDER_IMAGE } from "@/configs/config";

interface FormField {
    name: string;
    label: string;
    field_type: string;
    is_required?: boolean;
    is_visible?: boolean;
    default_value?: string;
    options?: { label: string; value: string }[];
    settings?: { display_grid?: string; tag_name?: string };
}

interface FormData {
    title: string;
    fields: FormField[];
}

const InlineForm: React.FC<{
    formId: string;
    dealerDomain: string;
    onClose: () => void;
    hit: Vehicle;
}> = ({ formId, dealerDomain, onClose, hit }) => {
    const [formData, setFormData] = React.useState<FormData | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [formValues, setFormValues] = React.useState<Record<string, string>>(
        {}
    );

    React.useEffect(() => {
        if (formId) fetchFormData();
        // eslint-disable-next-line
    }, [formId]);

    const fetchFormData = async () => {
        setLoading(true);
        try {
            const response = await getFormField(formId, dealerDomain);
            if (response.success) setFormData(response.data);
        } catch (error) {
            console.error("[InlineForm] Error fetching form:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (fieldName: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const result = await submitForm(formValues, formId, dealerDomain);

            if (result.success && result.data) {
                toast.success("Form submitted successfully!", {
                    description:
                        "Thank you for your submission. We'll get back to you soon.",
                    duration: 4000,
                });
                setTimeout(() => onClose(), 1200);
            }
        } catch (error) {
            // Optionally handle error
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
                return (
                    <div key={field.name} className="mb-6 w-full">
                        <label
                            htmlFor={field.name}
                            className="block text-[16px] font-bold text-black tracking-wide uppercase mb-2"
                        >
                            {field.label}
                            {isRequired && <span className="text-[#B3132B]">*</span>}
                        </label>
                        <input
                            id={field.name}
                            type={field.field_type}
                            name={field.name}
                            placeholder={
                                field.field_type === "email" ? "example@email.com" : ""
                            }
                            className="w-full bg-transparent border-0 border-b border-gray-200 text-[18px] text-black placeholder-gray-400 focus:ring-0 focus:border-black px-0 py-2"
                            required={isRequired}
                            defaultValue={field.default_value || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            disabled={submitting}
                            autoComplete={field.field_type === "email" ? "email" : undefined}
                        />
                    </div>
                );
            case "tel":
                return (
                    <div key={field.name} className="mb-6 w-full">
                        <label
                            htmlFor={field.name}
                            className="block text-[16px] font-bold text-black tracking-wide uppercase mb-2"
                        >
                            {field.label}
                        </label>
                        <input
                            id={field.name}
                            type="tel"
                            name={field.name}
                            placeholder="xxx-xxx-xxxx"
                            className="w-full bg-transparent border-0 border-b border-gray-200 text-[18px] text-black placeholder-gray-400 focus:ring-0 focus:border-black px-0 py-2"
                            required={isRequired}
                            defaultValue={field.default_value || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            disabled={submitting}
                            pattern="[0-9]{9}"
                            inputMode="numeric"
                            maxLength={9}
                            minLength={9}
                            autoComplete="tel"
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
            case "textarea":
                return (
                    <div key={field.name} className="mb-6 w-full">
                        <label
                            htmlFor={field.name}
                            className="block text-[16px] font-bold text-black tracking-wide uppercase mb-2"
                        >
                            {field.label}
                        </label>
                        <textarea
                            id={field.name}
                            name={field.name}
                            placeholder="Enter Your Comment Here"
                            rows={3}
                            className="w-full bg-transparent border-0 border-b border-gray-200 text-[18px] text-black placeholder-gray-400 focus:ring-0 focus:border-black px-0 py-2 resize-none"
                            required={isRequired}
                            defaultValue={field.default_value || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            disabled={submitting}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    // Vehicle summary data
    const vehicle = {
        image: hit.photo || "https://placehold.co/300x200",
        title: hit.title,
        subtitle: hit.drive_train,
        msrp: hit.prices?.retail_price_formatted,
        sale:
            hit.prices?.dealer_sale_price_formatted ||
            hit.prices?.sale_price_formatted,
    };
    const encryptedUrl = useEncryptedImageUrl(hit.photo || "");

    if (loading) return <div className="py-8 text-center">Loading form...</div>;
    if (!formData)
        return <div className="py-8 text-center">Form unavailable.</div>;

    return (
        <>
            {/* Vehicle summary card at the top of the form */}
            <div className="flex flex-col items-center mb-8">
                {/* <div className="relative w-full flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 z-10 p-2 flex items-center justify-center rounded-full bg-black text-white text-2xl focus:outline-none"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <XIcon className="w-4 h-4" />
          </button>
        </div> */}
                <div className="w-full bg-[#f6f6f6] rounded-3xl flex flex-row items-center gap-6 px-6 py-6 mb-2">
                    <div className="flex-shrink-0">
                        <img
                            className="rounded-2xl object-cover w-32 h-28"
                            src={hit?.photo ? encryptedUrl : PLACEHOLDER_IMAGE}
                            alt={hit.year + " " + hit.make + " " + hit.model}
                            fetchPriority={
                                hit.__position && hit.__position <= 3 ? "high" : "auto"
                            }
                            // Prioritize and avoid lazy-loading for top-ranked images to improve LCP.
                            loading={hit.__position && hit.__position <= 3 ? "eager" : "lazy"}
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className=" text-base font-bold text-black leading-tight truncate">
                            {vehicle.title}
                        </div>
                        <div className="text-sm text-[#7c818b] font-medium mb-2">
                            {vehicle.subtitle}
                        </div>
                        <div className="flex items-end  flex-row w-full justify-end gap-4 mt-2">
                            {vehicle.msrp && (
                                <span className="text-sm text-[#7c818b] line-through">
                                    {vehicle.msrp}
                                </span>
                            )}
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-[#7c818b] font-semibold uppercase">
                                    Sale Price
                                </span>
                                <span className=" font-bold text-lg text-black">
                                    {vehicle.sale}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {formData?.fields?.map((field, idx) => (
                    <div key={field.name || idx} className="w-full">
                        {renderField(field)}
                    </div>
                ))}
                <div className="pt-4 mt-6  bg-white sticky bottom-0">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-black text-white py-3 rounded-full font-semibold text-sm  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                </div>
            </form>
        </>
    );
    };

export default React.memo(InlineForm);