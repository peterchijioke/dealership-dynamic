export function formatDateToMMDDYYYY(dateString?: string | null): string {
	if (!dateString) {
		// Handle missing or null dateString safely
		return '';
	}
	let date: Date;

	// If the string contains ISO format
	if (dateString.includes('T') || dateString.includes('Z')) {
		date = new Date(dateString);
		if (isNaN(date.getTime())) {
			throw new Error('Wrong date format');
		}

		// use UTC methods to avoid timezone shift
		const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
		const dd = String(date.getUTCDate()).padStart(2, '0');
		const yyyy = date.getUTCFullYear();
		return `${mm}/${dd}/${yyyy}`;
	} else {
		// Format: yyyy-mm-dd
		const parts = dateString.split('-');
		if (parts.length !== 3) {
			throw new Error('Wrong date format');
		}
		const [year, month, day] = parts;
		const numYear = Number(year);
		const numMonth = Number(month);
		const numDay = Number(day);
		if (
			isNaN(numYear) ||
			isNaN(numMonth) ||
			isNaN(numDay) ||
			numDay < 1 ||
			numDay > 31 ||
			numMonth < 1 ||
			numMonth > 12
		) {
			throw new Error('Wrong date format');
		}
		// Create a date as UTC to avoid the influence of the local time zone
		const dateObj = new Date(Date.UTC(numYear, numMonth - 1, numDay));
		const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
		const dd = String(dateObj.getUTCDate()).padStart(2, '0');
		const yyyy = dateObj.getUTCFullYear();
		return `${mm}/${dd}/${yyyy}`;
	}
}
