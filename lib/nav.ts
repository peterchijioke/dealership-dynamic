
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

   console.log('==========NAV==========================');
  console.log(JSON.stringify({data,url:baseUrl + getWebsiteInformationPath()}, null, 2));
  console.log('=============NAV=======================');

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
  console.log('==========getThemeImage==========================');
  console.log(JSON.stringify(data, null, 2));
  console.log('=============getThemeImage=======================');
  return data;
}
  