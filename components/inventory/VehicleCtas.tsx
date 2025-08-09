/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { ReactNode, use, useCallback, useEffect, useState } from "react";
import { VehicleCta } from "../../types/vehicle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { isMobile } from "@/utils/device";

interface Props {
  buttons: VehicleCta[];
  vinNumber: string;
  className?: string;
  buttonClassName?: string;
  linkClassName?: string;
  onFormButtonClick?: (formId: string) => void;
  svgComponent?: ReactNode;
}

const Button = ({
  button,
  onClick,
  buttonClassName,
  svgComponent,
}: {
  button: VehicleCta;
  onClick?: VoidFunction;
  buttonClassName?: string;
  svgComponent?: ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      type="button"
      className={classNames(
        "w-full rounded px-3 py-[2px] text-button-1",
        button.btn_classes.join(" "),
        buttonClassName
      )}
      style={{
        backgroundColor: button.btn_styles?.bg,
        color: button.btn_styles?.text_color,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
      onMouseEnter={(e: any) => {
        setIsHovered(true);
        e.target.style.color =
          button.btn_styles.text_hover_color ?? button.btn_styles.text_color;
        e.target.style.backgroundColor =
          button.btn_styles.bg_hover ?? button.btn_styles.bg;
      }}
      onMouseLeave={(e: any) => {
        setIsHovered(false);
        e.target.style.color = button.btn_styles.text_color;
        e.target.style.backgroundColor = button.btn_styles.bg;
      }}
      {...button.btn_attributes}
      aria-label={`Aria ${button.cta_label}`}
    >
      {button.cta_label}
      {svgComponent && isHovered && <span>{svgComponent}</span>}
    </button>
  );
};

function VehicleCTAs(props: Props) {
  const {
    buttons,
    className,
    vinNumber,
    onFormButtonClick,
    buttonClassName,
    linkClassName,
    svgComponent,
  } = props;

  const router = useRouter();

  // const fetchAndUpdateData = useCallback(async (url: string) => {
  //   const updatedPayload = {
  //     response_mode: "srp",
  //     page: 1,
  //     order: "asc",
  //     url_filtering: url,
  //   };
  //   try {
  //     const result = await fetchCarsAndFiltersData(updatedPayload);
  //     const url = new URL(result.currentSrpUrl);
  //     const pathWithQuery = url.pathname + url.search;
  //     router.push(pathWithQuery, { scroll: false });
  //   } catch (error) {
  //     console.error("Failed to fetch data:", error);
  //   } finally {
  //   }
  // }, []);

  return (
    <div className={classNames(className, "flex flex-col gap-2")}>
      {buttons
        ?.filter((button) =>
          isMobile
            ? ["mobile", "both"].includes(button.device)
            : ["desktop", "both"].includes(button.device)
        )
        .map((button, index) => {
          switch (button.cta_type) {
            case "link": {
              const [isClient, setIsClient] = useState(false);
              const [isHided, setIsHided] = useState(false);

              useEffect(() => {
                setIsClient(true);
                const path = new URL(window.location.href).pathname;
                const search = new URL(window.location.href).search;
                const hidden = path === button.btn_content && search === "";
                setIsHided(hidden);
              }, []);

              if (!isClient) {
                return null; // prevents hydration mismatch
              }

              return (
                <Button
                  key={String(index)}
                  // onClick={() => fetchAndUpdateData(button.btn_content)}
                  button={button}
                  buttonClassName={buttonClassName}
                  aria-label={`Aria ${button.cta_label}`}
                  svgComponent={svgComponent}
                />
              );
            }
            case "html":
              return (
                <div
                  key={String(index)}
                  style={{
                    backgroundColor: button.btn_styles?.bg,
                    color: button.btn_styles?.text_color,
                    transition: "background-color 0.3s ease, color 0.3s ease",
                  }}
                  className="text-subtitle text-center cursor-pointer    w-full rounded px-3 py-[2px] text-button-1"
                  dangerouslySetInnerHTML={{ __html: button.btn_content }}
                />
              );
            case "roadster":
              return (
                <a
                  key={index}
                  href={`https://express.${button.btn_content}.com/express/${vinNumber}`}
                  target={"_blank"}
                >
                  <Button
                    button={button}
                    buttonClassName={buttonClassName}
                    aria-label={`Aria ${button.cta_label}`}
                  />
                </a>
              );
            default:
              return (
                <Button
                  button={button}
                  key={index}
                  onClick={() => onFormButtonClick?.(button.btn_content)}
                  buttonClassName={buttonClassName}
                  aria-label={`Aria ${button.cta_label}`}
                  svgComponent={svgComponent}
                />
              );
          }
        })}
    </div>
  );
}

export default VehicleCTAs;
