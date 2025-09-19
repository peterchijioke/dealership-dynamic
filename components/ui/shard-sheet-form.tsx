import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface ShardSheetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

export function ShardSheetForm({
  open,
  onOpenChange,
  children,
  title,
}: ShardSheetFormProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="max-w-md w-full z-50 md:min-w-xl px-3 rounded-3xl"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="py-2 px-1 overflow-y-auto max-h-[80vh]">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
