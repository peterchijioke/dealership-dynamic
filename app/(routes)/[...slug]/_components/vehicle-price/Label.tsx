import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  isStrong?: boolean;
};

function Label(props: Props) {
  const { className, children, isStrong = false } = props;
  return (
    <div
      className={cn(
        { "text-subtitle": !isStrong, "text-subtitle-strong": isStrong },
        className
      )}
    >
      {children}
    </div>
  );
}

export default Label;
