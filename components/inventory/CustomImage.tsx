import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import React from "react";

export default function CustomImage({ className, ...props }: ImageProps) {
  const { width, height, alt, sizes, src, ...rest } = props as ImageProps;

  // If src is empty or invalid, don't render to avoid browser fetching the page URL
  const isEmptySrc = !src || (typeof src === "string" && src.trim() === "");
  if (isEmptySrc) {
    return null;
  }

  // Use fill when width/height are not provided; this fits our carousel usage
  const shouldFill = !width || !height || (props as any).fill === true;

  if (shouldFill) {
    return (
      <div className={cn("relative w-full h-full")}>
        <Image
          src={src as any}
          {...(rest as any)}
          fill
          sizes={sizes || "100vw"}
          className={cn("object-cover", className)}
          alt={alt || ""}
          fetchPriority="high"
        />
      </div>
    );
  }

  return (
    <Image
      src={src as any}
      {...(rest as any)}
      width={width as number}
      height={height as number}
      fetchPriority="high"
      sizes={sizes || "100vw"}
      className={cn(className)}
      alt={alt || ""}
    />
  );
}
