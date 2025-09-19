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
      <SheetContent side="right" className="max-w-md w-full">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="py-2 px-1 overflow-y-auto max-h-[80vh]">{children}</div>
        <SheetClose className="mt-4 w-full bg-gray-200 py-2 rounded text-center font-semibold">
          Close
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
