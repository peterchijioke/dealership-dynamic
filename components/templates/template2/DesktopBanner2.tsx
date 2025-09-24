import VehicleCTAs from "@/components/inventory/VehicleCtas";
import SpecialDisclaimer from "@/components/SpecialDisclaimer";
import SpecialOffer from "@/components/SpecialOffer";
import { useWebsiteInfoContext } from "@/contexts/useWebsiteInfoContext";
import { SpecialT } from "@/types";
import { formatDateToMMDDYYYY } from "@/utils/formatDateToMMDDYYYY";
import { generateOffers } from "@/utils/offers";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { renderOffer } from "../renderOffer";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Form from "@/components/form/components";

type Props = {
  special: SpecialT;
};

function DesktopBanner2({ special }: Props) {
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedSpecial, setSelectedSpecial] = useState<SpecialT | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const { websiteInfo } = useWebsiteInfoContext();

  const handleFormOpen = (formId: any) => {
    setSelectedSpecial(special);
    setFormOpen(true);
    setSelectedFormId(formId);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSpecial(null);
  };

  const titleWords = special.title.split(" ");

  const contentClassName = "mx-auto";

  const offers = generateOffers(special);

  const renderSpecialOffer = (offer: (typeof offers)[0], index: number) => {
    if (!offer) return null;

    const wrapperClassName = "text-white text-start mx-auto flex items-center";

    const valueClassName = cn("font-bold relative text-4xl xl:text-[2.5rem]");

    const labelClassName = cn(
      " whitespace-pre-wrap text-left text-xs leading-none"
    );

    const signClassName = "top-0 align-top text-lg xl:text-2xl";

    return (
      <SpecialOffer
        offer={offer}
        wrapperClassName={wrapperClassName}
        valueClassName={valueClassName}
        labelClassName={labelClassName}
        signClassName={signClassName}
        key={index}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex h-[150px] w-full items-center bg-[#232323]">
        <div
          className={cn(
            contentClassName,
            "flex w-full items-center justify-evenly gap-2 px-[50px] xl:px-0",
            "relative h-full max-w-[1024px]"
          )}
        >
          <div className="flex grow flex-col">
            <div className="mt-[15px] flex gap-3 self-start text-white">
              <p
                className="text-sm capitalize"
                style={{ alignSelf: "anchor-center" }}
              >
                {titleWords.slice(0, 3).join(" ")}
              </p>
              <p className="text-lg font-bold uppercase lg:text-xl lg:leading-none">
                {titleWords.slice(3).join(" ")}
                <span className="capitalize"> {special.subtitle}</span>
              </p>

              {/* <span className="mt-1 flex items-center gap-1 text-white">
							{special.disclaimer && <InfoCircledIcon className="cursor-pointer" onClick={() => setDetailOpen(true)} />}

							{special.expire_at && (
								<p className="whitespace-nowrap text-xs leading-none">exp {formatDateToMMDDYYYY(special.expire_at)}</p>
							)}
						</span> */}
            </div>
            <div
              className={cn("flex justify-center ", {
                "gap-10": offers.length !== 3,
                "gap-2": offers.length === 3,
              })}
            >
              {/* <SortedOffers2 offers={offers as Offer[]} /> */}
              <div
                className={cn("grid gap-3 self-center", {
                  "h-[110px]": offers.length === 3,
                  "h-auto": offers.length !== 3,
                })}
                style={{
                  gridTemplateColumns: `repeat(${offers.length}, minmax(0, 1fr))`,
                }}
              >
                {offers.map(renderSpecialOffer)}
              </div>
              {special.image_url && offers.length === 1 && (
                <div className="relative  mr-1 aspect-[7/4] h-[125px] lg:mr-4">
                  <Image
                    alt={special.title}
                    src={special.image_url}
                    fill
                    className="!top-[20px] object-contain lg:!top-[20px]"
                    sizes="100px"
                  />
                </div>
              )}

              {special.image_url && offers.length > 1 && (
                <div
                  className={cn(
                    "relative  mr-1 aspect-[7/4] h-[110px] lg:mr-4 lg:h-[110px]",
                    {
                      "h-[70px] lg:h-[110px]": offers.length === 3,
                      "h-[110px] ": offers.length !== 3,
                    }
                  )}
                >
                  <Image
                    alt={special.title}
                    src={special.image_url}
                    fill
                    className="!top-[20px] object-contain lg:!top-[20px]"
                    sizes="100px"
                  />
                </div>
              )}

              <span className="absolute bottom-1 left-[50px] flex items-center gap-1 text-white xl:left-0">
                {special.disclaimer && (
                  <InfoCircledIcon
                    className="cursor-pointer"
                    onClick={() => setDetailOpen(true)}
                  />
                )}

                {special.expire_at && (
                  <p className="whitespace-nowrap text-xs leading-none">
                    exp {formatDateToMMDDYYYY(special.expire_at)}
                  </p>
                )}
              </span>
            </div>
          </div>
          <VehicleCTAs
            className="flex items-center gap-1 self-center"
            buttonClassName={cn(
              "rounded-sm px-2 whitespace-nowrap text-button-2 capitalize",
              "2xl:px-4 min-w-[120px]"
            )}
            buttons={special.cta.slice(0, 2)}
            // buttons={special.cta.length > 0 ? [special.cta[0]] : []}
            vinNumber=""
            onFormButtonClick={handleFormOpen}
          />
        </div>
      </div>

      <SpecialDisclaimer
        disclaimer={special.disclaimer}
        onClose={() => setDetailOpen(false)}
        isOpen={isDetailOpen}
        closePosition="right"
        subtitleClassName="mx-auto w-3/4 !mt-2 !text-[10px]"
        titleClassName="mx-auto w-3/4 !mt-2 !text-base"
        closePositionClass="!right-20"
        wrapperClassName="!max-w-[1024px] left-1/2 -translate-x-1/2"
      />
      {isFormOpen && (
        <Sheet
          open={isFormOpen}
          onOpenChange={(open) => {
            if (!open) handleFormClose();
          }}
        >
          <SheetContent
            side="right"
            className="!flex w-full !translate-y-0 flex-col !gap-0 bg-white !py-1 px-4 sm:w-[60vw]"
          >
            <h4 className="px-4 text-xl font-bold">{selectedSpecial?.title}</h4>
            <div className="flex w-full flex-wrap items-center justify-start gap-3">
              {offers.map((offer, index) =>
                renderOffer(offer, index, "bg-white !text-primary", true)
              )}
            </div>
            <Form
              className="relative mt-2 w-full bg-app-background p-4"
              formId={selectedFormId || ""}
              specialTypes={selectedSpecial?.special_types}
              vehicleTitle={selectedSpecial?.title}
              websiteInfo={websiteInfo}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

export default DesktopBanner2;
