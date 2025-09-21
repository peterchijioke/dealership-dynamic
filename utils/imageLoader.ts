export const imageLoader = ({ src, width }: any): string => {
	const parts = src.split('/v1/');
	if (parts.length < 2) {
		return src;
	}

	const prefix = parts[0];
	const rest = parts[1].split('/');

	rest[0] = String(width);

	return `${prefix}/v1/${rest.join('/')}`;
};
