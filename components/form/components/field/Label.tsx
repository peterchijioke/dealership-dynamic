import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  label: string;
  isRequired?: boolean;
  className?: string;
};

function Label(props: Props) {
  const { label, isRequired, className } = props;

  if (!label) return null;

  return (
    <label
      className={cn("block pb-1 text-left text-sm text-black/50", className)}
    >
      {label}
      {isRequired && <span className="text-danger">*</span>}
    </label>
  );
}

export default Label;
