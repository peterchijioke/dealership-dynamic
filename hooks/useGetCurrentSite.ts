'use client'

import { getDynamicPath } from '@/configs/config';
import { getHost, isSSR } from '@/utils/site';
import { usePathname } from 'next/navigation';

function convertOriginToURL(origin: string) {
	if (!/^https?:\/\//i.test(origin)) {
		return `https://${origin}`;
	} else {
		return origin.replace(/^https?:\/\//i, (match) => `${match}`);
	}
}

export const useGetCurrentSite = () => {
	const pathName = usePathname();

	const url = isSSR ? '' : window.location.host;
	const site = getDynamicPath()
	// getHost(url);

	const currentUrl = isSSR ? pathName : window.location.pathname + window.location.search;
	const urlWithoutSearchParams = `${convertOriginToURL(site as string)}${pathName as string}`;

	// const swapDomain = (url: string) => {
	// 	if (process.env.NODE_ENV === 'development') {
	// 		const urlObj = new URL(url);
	// 		// TODO: make url dynamic
	// 		urlObj.protocol = 'http:';
	// 		urlObj.host = 'localhost:3000';
	// 		return urlObj.toString();
	// 	}

	// 	return url;
	// };

	return {
		site,
		currentUrl: currentUrl ?? '',
		// swapDomain,
		urlWithoutSearchParams,
	};
};
