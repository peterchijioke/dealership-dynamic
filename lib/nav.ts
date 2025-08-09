
'use server'
import { getWebsiteInformationPath } from "@/configs/config";
export type NavItem = { label: string; href: string };

export async function getPrimaryNav(): Promise<NavItem[]> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL!+getWebsiteInformationPath(), {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    return [
      { label: "Home", href: "/" },
      { label: "Inventory", href: "/inventory" },
      { label: "Contact", href: "/contact" },
    ];
  }

  return (await res.json()) as any;
}
