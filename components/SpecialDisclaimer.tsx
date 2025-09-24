// import React from 'react';
// import { cn } from '@dealer-tower/primitives';
// import { CloseIcon } from '../../shared/assets/icons';

// type Props = {
// 	disclaimer: string;
// 	isOpen: boolean;
// 	onClose: VoidFunction;
// 	closePosition?: 'left' | 'right';
// 	titleClassName?: string;
// 	subtitleClassName?: string;
// 	closePositionClass?: string;
// 	wrapperClassName?: string;
// };

// function SpecialDisclaimer({
// 	disclaimer,
// 	isOpen,
// 	onClose,
// 	closePosition = 'right',
// 	titleClassName,
// 	subtitleClassName,
// 	closePositionClass,
// 	wrapperClassName,
// }: Props) {
// 	return (
// 		<div
// 			className={cn(
// 				'absolute bottom-0 z-4 h-full w-full overflow-auto bg-app-background transition-all duration-200 ',
// 				{
// 					'!h-0 opacity-0': !isOpen,
// 					'h-full opacity-[.98]': isOpen,
// 				},
// 				wrapperClassName
// 			)}
// 		>
// 			<div
// 				className={cn(
// 					'absolute top-4 cursor-pointer rounded bg-neutral-800 p-1',
// 					closePosition === 'left'
// 						? cn('left-4', closePositionClass)
// 						: cn('right-4', closePositionClass)
// 					// ? containerClassName
// 					// 	? 'left-25'
// 					// 	: 'left-4'
// 					// : containerClassName
// 					// ? 'right-25'
// 					// : 'right-4'
// 				)}
// 				onClick={onClose}
// 			>
// 				<CloseIcon width="20" height="20" />
// 			</div>
// 			<p className={cn('mx-4 mt-5  text-h4-extra', titleClassName)}>Details</p>
// 			<p className={cn('mx-4 mt-3  text-subtitle', subtitleClassName)}>{disclaimer}</p>
// 		</div>
// 	);
// }

// export default SpecialDisclaimer;
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

type Props = {
  disclaimer: string;
  isOpen: boolean;
  onClose: VoidFunction;
  closePosition?: "left" | "right";
  titleClassName?: string;
  subtitleClassName?: string;
  closePositionClass?: string;
  wrapperClassName?: string;
};

function SpecialDisclaimer({
  disclaimer,
  isOpen,
  onClose,
  closePosition = "right",
  titleClassName,
  subtitleClassName,
  closePositionClass,
  wrapperClassName,
}: Props) {
  return (
    <div
      className={cn(
        "special-disclaimer-wrapper absolute bottom-0 z-4 w-full overflow-auto bg-app-background transition-all duration-200",
        {
          "special-disclaimer-hidden !h-0 opacity-0": !isOpen,
          "special-disclaimer-open h-full opacity-[.98]": isOpen,
        },
        wrapperClassName
      )}
    >
      <div
        className={cn(
          "special-disclaimer-close-button absolute top-4 cursor-pointer rounded bg-neutral-800 p-1",
          closePosition === "left"
            ? cn("close-left", closePositionClass)
            : cn("close-right", closePositionClass)
        )}
        onClick={onClose}
      >
        <X width="20" height="20" />
      </div>

      <div className="special-disclaimer-content px-4">
        <p
          className={cn(
            "special-disclaimer-title mt-5 text-h4-extra",
            titleClassName
          )}
        >
          Details
        </p>
        <p
          className={cn(
            "special-disclaimer-text mb-6 mt-3 text-subtitle",
            subtitleClassName
          )}
        >
          {disclaimer}
        </p>
      </div>
    </div>
  );
}

export default SpecialDisclaimer;
