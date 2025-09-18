import React from "react";
import Image from "next/image";
import { formatNumber } from "@/utils/utils";
import { CrossIcon } from "lucide-react";
import { OemIncentiveT } from "@/types/vehicle";
import * as Dialog from "@radix-ui/react-dialog";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  incentive: OemIncentiveT;
};

function IncentiveDrawer(props: Props) {
  const { onClose, incentive, isOpen } = props;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 h-screen w-full bg-white shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right lg:w-[25vw]">
          <div className="flex items-center justify-between bg-secondary p-4">
            <Dialog.Title className="text-white text-h4">
              {incentive.title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={onClose}
              >
                <CrossIcon color="white" width={32} height={32} />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>

          <div className="flex items-center gap-3 p-4 border-complete-b">
            {incentive.image_url && (
              <Image
                alt={incentive.title}
                src={incentive.image_url}
                width={152}
                height={114}
                className="shrink-0"
              />
            )}

            <div>
              <h4 className="text-h4-extra">{incentive.title}</h4>
              <p className="text-body-1">{incentive.subtitle}</p>
            </div>
          </div>

          <p className="p-4 text-subtitle border-complete-b">
            Disclaimer: {incentive.disclaimer}
          </p>

          <div className="flex items-start justify-between p-4">
            <p className="max-w-[70%] text-h4">{incentive.title}</p>
            <p className="text-h4-extra">
              {incentive.cashback_price
                ? `$${formatNumber(incentive.cashback_price)}`
                : null}
              {incentive.incentive_type === "finance"
                ? `${incentive.finance_apr}% APR - ${incentive.finance_apr_month} Months`
                : null}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default IncentiveDrawer;
