import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "./scroll-area";

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
        className="max-w-md w-full z-[1000] md:min-w-xl px-3 rounded-3xl"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="py-2 px-1 h-svh">{children}</ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
