'use server'
import { baseUrl, getDynamicPath, getWebsiteInformationPath } from "@/configs/config";

export type NavItem = { label: string; href: string };

export async function getPrimaryNav(): Promise<NavItem[]> {
  const res = await fetch(baseUrl + getWebsiteInformationPath(), {
    next: { revalidate: 600 }, // 10 minutes
    cache: 'force-cache'
  });

  if (!res.ok) {
    return [
      { label: "Home", href: "/" },
      { label: "Inventory", href: "/inventory" },
      { label: "Contact", href: "/contact" },
    ];
  }
  
  return (await res.json()) as NavItem[];
}

export const getThemeImage = async (path: string): Promise<any> => {
  const response = await fetch(baseUrl + `/${getDynamicPath()}${path}`, {
    headers: { 'accept': 'application/json' },
    next: { revalidate: 3600 }, 
    cache: 'force-cache'
  });

  if (!response.ok) {
    return null;
  }
  
  return (await response.json()) as any;
};



export async function getSpecialBanner(data:any) {
  const response = await fetch(`${baseUrl}/${getDynamicPath()}/get-specials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}