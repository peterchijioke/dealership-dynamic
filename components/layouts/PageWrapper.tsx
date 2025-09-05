import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import { getPrimaryNav, getThemeImage } from "@/lib/nav";

export default async function PageWrapper({
  children,
  sticky = true,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  const navItems = (await getPrimaryNav()) as any;
  const imagesRaw = (await getThemeImage("/line-up?theme=colorful")) as any;
  const data = navItems?.data;
  return (
    <>
      <div className={sticky ? "fixed top-0 z-50 w-full" : ""}>
        <SiteHeader imagesRaw={imagesRaw?.data ?? {}} items={data ?? {}} />
      </div>

      <div className="grid bg-[#FAF9F7]">{children}</div>
    </>
  );
}
