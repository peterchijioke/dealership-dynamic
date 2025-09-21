import { useState, useEffect } from 'react';

export default function useIsSmallScreen(breakpoint: number = 1280) {
	const [isSmall, setIsSmall] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsSmall(window.innerWidth < breakpoint);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [breakpoint]);

	return isSmall;
}
