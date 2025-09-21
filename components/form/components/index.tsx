// Fix Window type for dataLayer and turnstile
declare global {
  interface Window {
    dataLayer?: any[];
    turnstile?: any;
  }
}
import React, { useEffect, useMemo, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { fetchCsrfToken, getFormById, validateAndSubmit } from "../apis";

import ClipLoader from "react-spinners/ClipLoader";
import FieldRenderer from "./FieldRenderer";
import SuccessSubmitMessage from "./field/SuccessSubmitMessage";
import SubmitButton from "./field/Submit";
import FormElement from "./FormElement";
import { VehicleBaseT } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { getFormField, submitForm } from "@/app/api/dynamic-forms";
import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";

type Props = {
  formId: string;
  vehicleId?: string;
  dealerId?: string;
  className?: string;
  onFormSubmit?(data: any): void;
  termValue?: string;
  creditScoreStart?: string;
  creditScoreEnd?: string;
  specialTypes?: string[];
  vehicleTitle?: string;
  websiteInfo?: any;
  vehicle?: any;
};

const targetCheckboxes = ["finance", "cashback", "lease", "discount"];

const generateFormItems = (
  // vehicle: VehicleDTO | VehicleBaseT,
  // formTitle: string | undefined,
  // vehicleId: string | undefined
  vehicle: any,
  formTitle: string | undefined,
  vehicleId: string | undefined
) => ({
  // form_name: formTitle ?? 'Form',
  // item_id: vehicle.vin_number ?? vehicleId,
  // item_number: vehicle.stock_number,
  // item_price: vehicle.price,
  // item_condition: vehicle.condition,
  // item_year: vehicle.year,
  // item_make: vehicle.make,
  // item_model: vehicle.model,
  // item_trim: vehicle.trim,
  // item_color: vehicle.ext_color,
  // item_type: vehicle.body,
  // item_fuel_type: vehicle.fuel_type,
  form_name: formTitle ?? "Form",
  item_id: vehicle?.vin_number ?? vehicleId ?? "",
  item_number: vehicle?.stock_number ?? "",
  item_price: vehicle?.price ?? "",
  item_condition: vehicle?.condition ?? "",
  item_year: vehicle?.year ?? "",
  item_make: vehicle?.make ?? "",
  item_model: vehicle?.model ?? "",
  item_trim: vehicle?.trim ?? "",
  item_color: vehicle?.ext_color ?? "",
  item_type: vehicle?.body ?? "",
  item_fuel_type: vehicle?.fuel_type ?? "",
});

const eventMap: { [key: string]: string } = {
  "7b2844c8-c294-413e-8181-f9f75547f3df": "asc_form_submission_parts",
  "f0e4328e-9a94-4f89-a160-a9cce425f290": "asc_form_submission_parts",
  "9845f5d7-fd01-49e9-9e9c-ee358b39331a": "asc_form_submission_service",
  "8c5925b0-fa04-431f-be47-b57dc57dd5cb": "aasc_form_submission_service",
};
const formSubmittedPushDataLayer = (
  vehicle: any,
  vehicleId: string | undefined,
  formId: string,
  formTitle: string | undefined
) => {
  const event = eventMap[formId] || "asc_form_submission_sales";
  const itemPageViewEvent = {
    event: event,
    ...generateFormItems(vehicle, formTitle, vehicleId),
  };

  const dataLayer: any[] = window.dataLayer || [];
  dataLayer.push(itemPageViewEvent);
};

function Form(props: Props) {
  const {
    formId,
    className,
    vehicleId,
    dealerId,
    onFormSubmit,
    termValue,
    creditScoreStart,
    creditScoreEnd,
    specialTypes,
    vehicleTitle,
    websiteInfo,
    vehicle,
  } = props;

  const formMethods = useForm({
    mode: "onChange",
  });
  const { handleSubmit, setValue, watch } = formMethods;

  // const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isTextareaTouched, setIsTextareaTouched] = useState(false);
  const [cfTurnstileToken, setCfTurnstileToken] = useState<string | null>(null);
  const successRef = useRef<any>(null);

  const formatDateFields = (data: any) => {
    const formattedData = { ...data };
    for (const key in data) {
      if (
        Object.prototype.hasOwnProperty.call(data, key) &&
        typeof data[key] === "string" &&
        data[key].includes("/")
      ) {
        const dateObject = new Date(data[key]);
        if (!isNaN(dateObject.getTime())) {
          const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
          const day = ("0" + dateObject.getDate()).slice(-2);
          const year = dateObject.getFullYear();
          formattedData[key] = `${year}-${month}-${day}`;
        }
      }
    }
    return formattedData;
  };

  // useEffect(() => {
  // 	const initCsrfToken = async () => {
  // 		try {
  // 			const token = await fetchCsrfToken();
  // 			setCsrfToken(token);
  // 		} catch (error) {
  // 			console.error('Failed to fetch CSRF token:', error);
  // 		}
  // 	};

  // 	initCsrfToken();
  // }, []);

  const { site } = useGetCurrentSite();

  // const { data, isLoading } = useQuery({
  //   queryKey: ["form", formId],
  //   queryFn: () => getFormById(site, formId),
  // });

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await getFormField(formId, site);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      }
    };

    fetchFormData();
  }, [formId, site]);

  // const { isSuccess, isPending, mutate } = useMutation({
  // 	mutationFn: (payload) => {
  // 		// console.log('payload', payload);
  // 		console.log('▶️ mutationFn payload:', payload);
  // 		if (vehicle && vehicleId && formId && data?.title)
  // 			formSubmittedPushDataLayer(vehicle, vehicleId, formId, data?.title);
  // 		return validateAndSubmit(site, formId, formatDateFields(payload));
  // 	},
  // 	onError: (err) => console.error('❌ validateAndSubmit error:', err),
  // 	onSuccess: () => console.log('✅ validateAndSubmit succeeded'),
  // });
  // const mutation = useMutation({
  //   mutationFn: (payload:any) => {

  // 		return submitForm(payload, formId, site);
  //   },
  //   onError: (err:any) => console.error("❌ validateAndSubmit error:", err),
  //   onSuccess: (dataResponse, variables) => {
  //     formSubmittedPushDataLayer(vehicle, vehicleId, formId, data?.title);
  //     onFormSubmit?.(variables);
  //   },
  // });

  const [success, setSuccess] = useState<any>(false);

  const submitFormData = async (data: any) => {
    setIsSubmiting(true);
    try {
      const response = await submitForm(data, formId, site);
      if (response.success || response.data) {
        formSubmittedPushDataLayer(vehicle, vehicleId, formId, data?.title);
        setSuccess(true);
        successRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setIsSubmiting(false);
      setSuccess(false);
    }
  };

  const replaceMsrpWithDiscount = (arr: string[]): string[] =>
    arr.map((item) => (item === "msrp" ? "discount" : item));

  const specialTypesWithDiscount = replaceMsrpWithDiscount(specialTypes ?? []);

  useEffect(() => {
    const hiddenInputFields = data?.fields.filter(
      (field: any) => field.field_type === "hidden"
    );
    if (hiddenInputFields && hiddenInputFields.length > 1) {
      hiddenInputFields.forEach((hiddenInputField: any) => {
        switch (hiddenInputField.name) {
          case "vehicle_id":
            setValue(hiddenInputField.name, vehicleId);
            break;
          case "term_value":
            setValue(hiddenInputField.name, termValue);
            break;
          case "credit_score_end":
            setValue(hiddenInputField.name, creditScoreEnd);
            break;
          case "credit_score_start":
            setValue(hiddenInputField.name, creditScoreStart);
            break;
          default:
            const value = hiddenInputField.settings.vehicle
              ? vehicleId
              : dealerId;
            setValue(hiddenInputField.name, value);
            break;
        }
      });
    } else if (hiddenInputFields) {
      hiddenInputFields.forEach((hiddenInputField: any) => {
        const value = hiddenInputField.settings.vehicle ? vehicleId : dealerId;
        setValue(hiddenInputField.name, value);
      });
    }
  }, [data]);

  const [isSubmiting, setIsSubmiting] = useState(false);

  const generateTextareaValue = React.useCallback(
    (checkedNames: string[]) => {
      const initialComment = vehicleTitle
        ? `I'm interested in ${vehicleTitle} offer. `
        : "";
      const filteredNames = checkedNames.filter((name) =>
        targetCheckboxes.includes(name)
      );

      if (filteredNames.length === 0) {
        return initialComment;
      }

      const offersText =
        filteredNames.length === 1
          ? `I'm interested in ${filteredNames[0]} offer.`
          : `I'm interested in ${filteredNames.join(", ")} offers.`;

      return vehicleTitle
        ? `I'm interested in ${vehicleTitle} offer. ${offersText}`
        : offersText;
    },
    [vehicleTitle]
  );
  const checkboxNames = useMemo(
    () =>
      data?.fields
        .filter((field: any) => field.field_type === "checkbox" && field.name)
        .map((field: any) => field.name) || [],
    [data]
  );

  const checkboxValues = watch(checkboxNames);

  useEffect(() => {
    const targetCheckedNames = checkboxNames.filter(
      (name: any, idx: any) =>
        checkboxValues[idx] && targetCheckboxes.includes(name)
    );

    const textareaField = data?.fields.find(
      (field: any) => field.field_type === "textarea"
    );
    if (textareaField && textareaField.name) {
      const newText = generateTextareaValue(targetCheckedNames);

      const currentText = watch(textareaField.name);

      if (!isTextareaTouched && newText !== currentText) {
        // setValue(textareaField.name, newText, { shouldValidate: true });
        setValue(textareaField.name, newText);
      }
    }
  }, [
    checkboxValues,
    setValue,
    data,
    checkboxNames,
    generateTextareaValue,
    watch,
    isTextareaTouched,
  ]);

  // useEffect(() => {
  // 	const checkedNames = checkboxNames.filter((_, idx) => checkboxValues[idx]);

  // 	const textareaField = data?.fields.find((field) => field.field_type === 'textarea');
  // 	if (textareaField && textareaField.name) {
  // 		setValue(textareaField.name, generateTextareaValue(checkedNames));
  // 	}
  // }, [checkboxValues, setValue, data]);

  const turnstileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (websiteInfo?.is_captcha_enabled && websiteInfo?.captcha_site_key) {
      const scriptId = "cf-turnstile-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
          console.log(
            "Turnstile script loaded, window.turnstile =",
            (window as any).turnstile
          );
          const container = turnstileRef.current;
          if (container instanceof HTMLElement) {
            (window as any).turnstile.render(container, {
              sitekey: websiteInfo.captcha_site_key,
              callback: (token: string) => setCfTurnstileToken(token),
              "expired-callback": () => setCfTurnstileToken(null),
            });
          } else {
            console.error("Turnstile container not found");
          }
        };
      } else {
        console.log(
          "Turnstile script already present, window.turnstile =",
          (window as any).turnstile
        );

        // const container = turnstileRef.current;
        // if (container instanceof HTMLElement) {
        // 	window.turnstile.render(container, {
        // 		sitekey: websiteInfo.captcha_site_key,
        // 		callback: (token: string) => setCfTurnstileToken(token),
        // 		'expired-callback': () => setCfTurnstileToken(null),
        // 	});
        // } else {
        // 	console.error('Turnstile container not found');
        // }

        if (typeof window !== "undefined") {
          const container = turnstileRef.current;
          if (container instanceof HTMLElement) {
            if (
              (window as any).turnstile &&
              typeof (window as any).turnstile.render === "function"
            ) {
              (window as any).turnstile.render(container, {
                sitekey: websiteInfo.captcha_site_key,
                callback: (token: string) => setCfTurnstileToken(token),
                "expired-callback": () => setCfTurnstileToken(null),
              });
            } else {
              console.error("Turnstile is not available on window");
            }
          } else {
            console.error("Turnstile container not found");
          }
        }
      }
    }
  }, [websiteInfo, data]);

  const submitField = data?.fields.find(
    (field: any) => field.field_type === "submit"
  );

  return (
    <>
      <ClipLoader
        loading={false as any}
        color="var(--color-secondary)"
        size={24}
        className="mx-auto mt-10"
      />

      {data && (
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit((formData: any) => {
              const payload = { ...formData };
              if (websiteInfo?.is_captcha_enabled) {
                if (!cfTurnstileToken) {
                  // block submit until token is ready
                  return;
                }
                payload.cfTurnstileToken = cfTurnstileToken;
              }
              return submitFormData(payload);
            })}
            className={cn(
              "relative z-9 grid  w-full grid-cols-12 gap-x-2.5 gap-y-3.5 py-4",
              className
            )}
          >
            {data.fields
              .map((field: any) => {
                if (
                  field.field_type === "checkbox" &&
                  field.name &&
                  targetCheckboxes.includes(field.name) &&
                  !specialTypesWithDiscount.includes(field.name)
                ) {
                  // return { ...field, is_visible: false };
                  field.is_visible = false;
                }

                if (
                  field.field_type === "checkbox" &&
                  field.name === "agree" &&
                  field.label &&
                  websiteInfo?.name &&
                  !field.label.includes(websiteInfo?.name)
                ) {
                  field.label = `${websiteInfo?.name} ${field.label}`;
                }

                return field;
              })
              .filter((field: any) => field.is_visible)
              // .filter((field) => field.field_type !== 'hidden')
              .filter(
                (field: any) =>
                  field.field_type !== "hidden" && field.field_type !== "submit"
              )
              .map((field: any, index: any) => (
                <FormElement
                  key={field.id || `field-${index}`}
                  field={field}
                  isPending={isSubmiting}
                  setIsTextareaTouched={setIsTextareaTouched}
                />
              ))}
            {websiteInfo?.is_captcha_enabled && (
              <div ref={turnstileRef} id="cf-turnstile" />
            )}

            {/* {!submitField && <SubmitButton key={`success-${formId}`} isPending={mutation.isPending} />} */}

            <SubmitButton
              key={`success-${formId}`}
              isPending={
                isSubmiting ||
                (websiteInfo?.is_captcha_enabled === true && !cfTurnstileToken)
              }
              fieldData={submitField}
            />

            {success && (
              <div ref={successRef}>
                <SuccessSubmitMessage key="success submit message" />
              </div>
            )}
          </form>
        </FormProvider>
      )}
    </>
  );
}

export default Form;
