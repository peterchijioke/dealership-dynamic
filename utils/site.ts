export function getHost(url: string): string {
	if (process.env.NODE_ENV === 'development') {
		return process.env.NEXT_PUBLIC_DEV_SITE as string;
	}
	return url;
}

export function changeLocalhost(url: string) {
	if (process.env.NODE_ENV === 'development') {
		const urlObj = new URL(url);
		urlObj.protocol = 'http:';
		urlObj.host = process.env.NEXT_PUBLIC_HOST as string;
		urlObj.port = '';
		return urlObj.toString();
	}

	return url;
}

export function changeToLocalhost(url: string) {
	if (process.env.NODE_ENV === 'development') {
		const urlObj = new URL(url);
		urlObj.protocol = 'http:';
		urlObj.host = 'localhost:3000';

		return urlObj.toString();
	}

	return url;
}
export const isSSR = typeof window === 'undefined';
