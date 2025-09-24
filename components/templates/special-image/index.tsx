import React from "react";
import Link from "next/link";
import Image from "next/image";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { SpecialT } from "@/types";

type Props = {
  special: SpecialT;
  index?: number;
};

function SpecialImageSrp(props: Props) {
  const { special, index } = props;

  const isMdScreen = useIsSmallScreen(1024);

  const imageUrl = isMdScreen
    ? special.mobile_image_url ?? special.image_url
    : special.image_url;

  return (
    <Link
      prefetch={false}
      href={special.cta[0]?.btn_content ?? "/used-vehicles/?condition=new"}
      target={special.cta[0]?.open_newtab ? "_blank" : undefined}
      aria-label="special title"
      className="relative block h-full w-full overflow-hidden "
    >
      {imageUrl && (
        <Image
          // className={'mx-auto max-w-[972px] object-cover xl:max-w-[100%] 4xl:object-contain'}
          className={"object-contain"}
          alt={special.title}
          // src={imageLoader({ src: imageUrl, width: 972 })} // 972 is the width of the image for desktop, but if you want to use the width of the image for mobile, you can use another value
          src={imageUrl}
          fill
          priority={index === 0}
          sizes="100vw"
        />
      )}
    </Link>
  );
}

export default SpecialImageSrp;
