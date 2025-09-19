
'use server'
export async function getSpecialBanner(payload: any) {
  const response = await fetch(
    `${baseUrl}/${getDynamicPath()}/get-specials`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  
    console.log('==============getSpecialBanner======================');
    console.log(response);
    console.log('============getSpecialBanner========================');

  return await response.json();
}
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

  const data = await res.json();


  return data as any[];
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
  const data = await response.json();

  return data;
}
  