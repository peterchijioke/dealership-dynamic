import React, { useState } from "react";
import TagDisclaimer from "./TagDisclaimer";
import { cn } from "@/lib/utils";

type Props = {
  isSpecial: boolean;
  tags: TagT[];
};

function VehicleCardLabel(props: Props) {
  const { isSpecial, tags } = props;
  const [enableDisclaimer, setEnableDisclaimer] = useState<string>();

  const topLabelTag = tags.find((tag) => tag.tag_type === "top_label");

  const tagClassName =
    "vehicle-grid-card-label__badge text-white  bg-primary px-1.5 py-0.5 uppercase rounded-sm w-fit";

  return (
    <>
      {topLabelTag && (
        <div
          className={cn(
            "vehicle-grid-card-label__top-label left-0 absolute top-0 z-2 w-full rounded-t-xl py-1.5 text-center text-xs font-semibold",
            {
              "vehicle-grid-card-label__top-label--clickable cursor-help":
                !!topLabelTag.tag_disclaimer,
            }
          )}
          style={{
            color: topLabelTag.tag_color,
            background: topLabelTag.tag_background,
          }}
          onClick={() => setEnableDisclaimer(topLabelTag.tag_disclaimer)}
        >
          {topLabelTag.tag_content}
        </div>
      )}

      <div className="vehicle-grid-card-label__badge-container absolute -left-2 top-7 z-2 flex flex-col gap-1 text-sm  ">
        {tags
          .filter((tag) => tag.tag_type === "badge")
          .map((tag, index) => (
            <div
              key={index}
              className={cn(tagClassName, {
                "vehicle-grid-card-label__badge--clickable cursor-help":
                  !!tag.tag_disclaimer,
              })}
              style={{
                color: tag.tag_color,
                background: tag.tag_background,
              }}
              onClick={() => setEnableDisclaimer(tag.tag_disclaimer)}
            >
              {tag.tag_content}
            </div>
          ))}

        {isSpecial && (
          <div className="vehicle-grid-card-label__badge vehicle-grid-card-label__badge--special w-fit rounded-sm bg-rose-700 px-1.5 py-0.5 uppercase text-white">
            special
          </div>
        )}
      </div>

      <TagDisclaimer
        isOpen={!!enableDisclaimer}
        onClose={() => setEnableDisclaimer(undefined)}
        content={enableDisclaimer}
      />
    </>
  );
}

export default VehicleCardLabel;
export type TagT = {
  tag_background: string;
  tag_color: string;
  tag_content: string;
  tag_disclaimer: string;
  tag_type: "top_label" | "badge";
};
