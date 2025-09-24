
'use server'



import { apiClient, baseUrl, getDynamicPath, getWebsiteInformationPath, specialBanner } from "@/configs/config";
import { SpecialGroup } from "@/types";

export async function getSpecials(site: string, payload: any) {
 	const channels = payload?.channels ?? [];
	const special_types = payload?.special_types ?? [];

	const requestBody: {
		channels: string[];
		special_types: string[];
		filters?: { [filterKey: string]: string[] };
	} = {
		channels,
		special_types,
	};

	if (!channels.includes('special_page')) {
		requestBody.filters = payload?.filters ?? {
			condition: ['new', 'used', 'certified'],
		};
	}

try {
    const res = await apiClient.post<{
    data: SpecialGroup[];
  }>(
    `/${site}${specialBanner}`,
    requestBody
  );

  return res.data.data;
} catch (error) {
  console.error(error);
  throw error;
}
}

export type NavItem = { label: string; href: string };

export async function getPrimaryNav(): Promise<any> {
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
  