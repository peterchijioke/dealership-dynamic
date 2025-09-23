import React from "react";

import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import SpecialImageSrp from "@/components/templates/special-image";
import MobileBanner from "@/components/templates/template1/MobileBanner";
import DesktopBanner2 from "@/components/templates/template2/DesktopBanner2";
import { SpecialT } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  special: SpecialT;
  index?: number;
};

function SpecialTopBannerTemplateRenderer(props: Props) {
  const { special, index } = props;

  const isMdScreen = useIsSmallScreen(768);

  const isJustImage =
    special.special_types.length === 1 && special.special_types[0] === "image";

  const template: any = "template1";

  const renderContent = () => {
    if (isJustImage) {
      return (
        <div className="relative mx-auto aspect-[1600/150] max-h-[150px]  w-full  lg:aspect-[2560/200]">
          <SpecialImageSrp special={special} index={index} />
        </div>
      );
    }

    switch (template) {
      case "template1":
        return (
          <div className="relative w-full">
            <div className="md:hidden w-full">
              <MobileBanner special={special} />
            </div>
            <div className="hidden md:block w-full">
              <DesktopBanner2 special={special} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    // <div className={classnames('relative w-full', !isMdScreen ? 'flex h-[150px] items-center' : '')}>
    <div
      className={cn("relative flex h-[125px] w-full items-center md:h-[150px]")}
    >
      {renderContent()}
    </div>
  );
}

export default SpecialTopBannerTemplateRenderer;
