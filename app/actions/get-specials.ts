"use server";

interface SpecialsFilters {
  condition?: string[];
  make?: string[];
  model?: string[];
  year?: string[];
  [key: string]: any;
}

interface SpecialsRequest {
  channels: string[];
  filters: SpecialsFilters;
}

interface SpecialsResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function getSpecials(
  domain: string,
  channels: string[] = ["srp_banner"],
  filters: SpecialsFilters = {}
): Promise<SpecialsResponse> {
  try {
    const requestBody: SpecialsRequest = {
      channels,
      filters,
    };

    const response = await fetch(`https://dealertower.app/api/${domain}/get-specials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error fetching specials:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Convenience function for Nissan specials
export async function getNissanSpecials(
  domain: string = "www.nissanofportland.com",
  channels: string[] = ["srp_banner"]
): Promise<SpecialsResponse> {
  return getSpecials(domain, channels, {
    condition: ["new"],
    make: ["Nissan"],
  });
}