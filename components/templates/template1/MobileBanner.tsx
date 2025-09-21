import React, { useState } from "react";
import Image from "next/image";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import SortedOffers from "./SortedOffers";

import { SpecialT } from "@/types";
import SpecialDisclaimer from "@/components/SpecialDisclaimer";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { formatDateToMMDDYYYY } from "@/utils/formatDateToMMDDYYYY";
import { cn } from "@/lib/utils";
import Form from "@/components/form/components";
import { renderOffer } from "../renderOffer";
import { generateOffers, Offer } from "@/utils/offers";
import VehicleCTAs from "@/components/inventory/VehicleCtas";
import { useWebsiteInfoContext } from "@/contexts/useWebsiteInfoContext";

type Props = {
  special: SpecialT;
};

function MobileBanner({ special }: Props) {
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
  };

  const offers = generateOffers(special);

  const titleWords = special.title.split(" ");

  return (
    <>
      <div className="relative h-[120px] w-full bg-[#232323] px-2 sm:px-4 py-2">
        <div className="flex h-full flex-wrap items-start justify-between gap-2 sm:gap-4 min-w-0">
          <div className="flex h-full grow flex-col justify-between gap-1 min-w-0">
            <span className="flex flex-wrap items-end gap-1 text-white">
              <p className="whitespace-nowrap text-[10px] capitalize leading-none s:text-[12px]">
                {titleWords.slice(0, 3).join(" ")}
              </p>
              <p className="whitespace-nowrap text-xs font-bold uppercase leading-none">
                {titleWords.slice(3).join(" ")}
                <span className="capitalize"> {special.subtitle}</span>
              </p>
            </span>

            <div className="flex grow flex-wrap justify-evenly gap-2 sm:gap-4 pb-2 min-w-0">
              <SortedOffers offers={offers as Offer[]} />
              {offers.length === 1 && (
                <div className="relative aspect-[7/4] h-[75px] self-center sm:h-[80px] min-w-0">
                  <Image
                    alt={special.title}
                    src={special.image_url}
                    fill
                    className="!top-[27px] object-contain"
                    sizes="(min-width: 440px) 70px, 61px"
                  />
                </div>
              )}
            </div>
          </div>
          <div
            className={cn("flex items-center justify-center min-w-0", {
              "h-[52px]": offers.length > 1,
              "h-[100px]": offers.length === 1,
            })}
          >
            <VehicleCTAs
              className="w-fit shrink-0"
              buttonClassName="rounded-sm !py-1 !text-xs capitalize whitespace-nowrap"
              buttons={special.cta.slice(0, 2)}
              vinNumber=""
              onFormButtonClick={handleFormOpen}
            />
          </div>
        </div>
      </div>
      <span className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
        {special.disclaimer && (
          <InfoCircledIcon
            className="cursor-pointer"
            onClick={() => setDetailOpen(true)}
          />
        )}
        {special.expire_at && (
          <p className="text-[8px]">
            Exp {formatDateToMMDDYYYY(special.expire_at)}
          </p>
        )}
      </span>
      {special.image_url && offers.length > 1 && (
        <div className="absolute -bottom-2.5 right-0 max-w-[40vw] min-w-0">
          <div className="relative right-3 aspect-[7/4] h-[62px] min-w-0">
            <Image
              alt={special.title}
              src={special.image_url}
              fill
              className="object-contain"
              sizes="(min-width: 440px) 70px, 61px"
            />
          </div>
        </div>
      )}
      <SpecialDisclaimer
        disclaimer={special.disclaimer}
        onClose={() => setDetailOpen(false)}
        isOpen={isDetailOpen}
        closePosition="right"
        subtitleClassName="!mt-2"
        titleClassName="!mt-2"
      />
      {isFormOpen && (
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleFormClose();
            }
          }}
        >
          <DialogContent className=" !flex w-full !translate-y-0 flex-col !gap-0 bg-white !py-1 px-4 sm:w-[60vw]">
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
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default MobileBanner;
