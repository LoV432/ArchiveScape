export function parseFilters(searchParams: { [key: string]: string | number }) {
	const filters: {
		dateStart?: Date;
		dateEnd?: Date;
		order: 'asc' | 'desc';
	} = { order: searchParams.order === 'asc' ? 'asc' : 'desc' };
	if (searchParams.dateStart) {
		filters.dateStart = new Date(searchParams.dateStart);
	}
	if (searchParams.dateEnd) {
		filters.dateEnd = new Date(searchParams.dateEnd);
	}
	return filters;
}
