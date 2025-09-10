import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  content?: string;
};

function TagDisclaimer(props: Props) {
  const { isOpen, content, onClose } = props;

  return (
    <div
      className={cn(
        "tag-disclaimer tag-disclaimer--container absolute left-0 top-0 z-3 !my-0 transform overflow-hidden rounded-xl bg-white/95 transition-all duration-200",
        {
          "tag-disclaimer--closed h-0 w-0": !isOpen,
          "tag-disclaimer--open h-full w-full p-4": isOpen,
        }
      )}
    >
      <div className="tag-disclaimer__header flex items-center gap-2 pb-2">
        <X
          className="tag-disclaimer__close-icon cursor-pointer"
          onClick={onClose}
          height={20}
          width={20}
        />
        <p className="tag-disclaimer__title text-h5">Disclaimer</p>
      </div>

      <p className="tag-disclaimer__content mt-1 text-xs ">{content}</p>
    </div>
  );
}

export default TagDisclaimer;
