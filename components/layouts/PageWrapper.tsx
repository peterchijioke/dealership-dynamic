import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import { getPrimaryNav } from "@/lib/nav";

export default async function PageWrapper({
  children,
  className = "",
  contentClassName = "mx-auto max-w-7xl px-4 py-6",
  sticky = true,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  sticky?: boolean;
}) {
  const navItems = (await getPrimaryNav()) as any;
  const data = navItems?.data;
  return (
    <>
      <div className={sticky ? "sticky top-0 z-50" : ""}>
        <SiteHeader items={data} />
      </div>

      {children}
    </>
  );
}
