'use client'
import { encryptObject } from '@/utils/utils';
import { useEffect, useState } from 'react';

const urlCache = new Map<string, string>();

function useEncryptedImageUrl(photo: string) {
	const [encryptedUrl, setEncryptedUrl] = useState<string>();
	const key = process.env.NEXT_PUBLIC_IMG_KEY;

	useEffect(() => {
		if (!key || !photo) return;

		const cacheKey = JSON.stringify({ photo, width: 400, quality: 65, cache: 1 });

		if (urlCache.has(cacheKey)) {
			setEncryptedUrl(urlCache.get(cacheKey)!);
			return;
		}

		let isCancelled = false;

		encryptObject({
			url: photo,
			width: 400,
			quality: 65,
			cache: 1,
			}, key)
				.then((str) => {
					const finalUrl = `https://dealertower.app/image/${str}.avif`;
					urlCache.set(cacheKey, finalUrl);
					if (!isCancelled) setEncryptedUrl(finalUrl);
				})
				.catch(() => {
					// ignore encryption errors in UI; keep previous image or placeholder
					if (!isCancelled) setEncryptedUrl(undefined);
				});

		return () => {
			isCancelled = true;
		};
	}, [photo, key]);

	return encryptedUrl;
}

export default useEncryptedImageUrl;
