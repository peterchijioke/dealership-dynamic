




export function encodeAssetId(id: string): string {
  return encodeURIComponent(btoa(id))
}

export function decodeAssetId(encoded: string): string {
  return atob(decodeURIComponent(encoded))
}


export interface EncryptObjectParams {
	width?: number;
	url: string | string[];
	quality?: number;
	cache?: number;
}


export async function encryptObject(object: EncryptObjectParams, keyStr: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(JSON.stringify(object));
	const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(keyStr));
	const cryptoKey = await crypto.subtle.importKey('raw', keyHash, { name: 'AES-CTR' }, false, ['encrypt', 'decrypt']);
 
	// Create a fixed 16-byte counter (IV) filled with zeros.
	const iv = new Uint8Array(16);
 
	// Encrypt the data.
	const encryptedBuffer = await crypto.subtle.encrypt({ name: 'AES-CTR', counter: iv, length: 64 }, cryptoKey, data);
 
	// Convert the encrypted ArrayBuffer to a binary string.
	const encryptedArray = new Uint8Array(encryptedBuffer);
	let binary = '';
	for (let i = 0; i < encryptedArray.byteLength; i++) {
		binary += String.fromCharCode(encryptedArray[i]);
	}
 
	// Convert binary string to Base64.
	const base64 = btoa(binary);
	// Convert to URL-safe Base64.
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}



export default async function encryptedLoader({ src, width, quality }: {
  src: string;
  width?: number;
  quality?: number;
}): Promise<string> {
	const params = { url: src, width, quality, cache: 1 };
	const key = process.env.NEXT_PUBLIC_IMG_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_IMG_KEY is not defined");
  }
	const encrypted = await encryptObject(params, key);
	return `https://dealertower.app/image/${encrypted}.avif`;
}

export const isObject = (val: unknown): val is Record<string, unknown> =>
	typeof val === "object" && val !== null && !Array.isArray(val);




export const normalizeUrl = (url: string) => {
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname + u.search;
  } catch {
    return url;
  }
};









type AnyObject = { [key: string]: any };

export function cleanObject(obj: AnyObject): AnyObject {
  const result: AnyObject = {};

  for (const key in obj) {
    const value = obj[key];

    const isEmptyObject =
      value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0;

    if (
      value !== null &&
      value !== false &&
      !isEmptyObject
    ) {
      result[key] = value;
    }
  }

  return result;
}





export async function invalidateVehicleCache() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("vehicles");
  revalidateTag("inventory");
}


export const formatPrice = (price: number | bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

// Remove trailing ".00" from formatted price strings (e.g. "$10,000.00" -> "$10,000")
export const stripTrailingCents = (val?: string | null) => {
  if (!val) return "";
  try {
    // Remove any trailing .00 occurrences that directly follow the numeric portion
    return val.replace(/\.00(?=$|[^0-9])/g, "");
  } catch {
    return val;
  }
};

export const generateImagePreviewData = (imagePreview: string) =>
  `data:image/jpeg;base64,${imagePreview}`;


export const previewurl =
    "UklGRnIAAABXRUJQVlA4IGYAAADwAQCdASoMAAkAAUAmJYwCdAEOy+QpWgAA/uiU0K7BTDeyr8YIl1v3bADof4++we2QEribfwRCO5TAxCfxN3OOfMPrfCLqc6VyIzxpPcHCSLojeleYpuW5wuF5TzTFGEJb0oKDgAA=";
 import React from "react";
export const formatNumber = (price?: number | string | null) => {
	const numberValue = Number(price);
	if (isNaN(numberValue)) {
		return String(price);
	}
	return numberValue.toLocaleString('en-US');
};
