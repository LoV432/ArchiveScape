export function addOffsetLimit({
	query,
	paramsList,
	offset,
	limit
}: {
	query: string;
	paramsList: any[];
	offset: number;
	limit: number;
}) {
	paramsList.push(offset);
	query += ` OFFSET $${paramsList.length}`;
	paramsList.push(limit);
	query += ` LIMIT $${paramsList.length}`;

	return query;
}

export function addLocalLastId({
	query,
	paramsList,
	localLastId
}: {
	query: string;
	paramsList: any[];
	localLastId: number;
}) {
	paramsList.push(localLastId);
	if (query.includes('WHERE')) {
		query += ` AND messages.id <= $${paramsList.length}`;
	} else {
		query += ` WHERE messages.id <= $${paramsList.length}`;
	}
	return query;
}

export function addOrderBy({
	query,
	orderBy
}: {
	query: string;
	orderBy: string;
}) {
	query += ` ORDER BY ${orderBy}`;
	return query;
}

export function addDateRange({
	query,
	params,
	dateStart,
	dateEnd
}: {
	query: string;
	params: any[];
	dateStart?: Date;
	dateEnd?: Date;
}) {
	let whereOrAnd = query.includes('WHERE') ? 'AND' : 'WHERE';
	if (dateStart) {
		query += ` ${whereOrAnd} created_at >= $${params.length + 1}`;
		params.push(dateStart.toISOString());
		if (!dateEnd) {
			// If this is true we assume that the user wants to see all messages for the dateStart day
			dateEnd = new Date(dateStart);
			dateEnd.setDate(dateEnd.getDate() + 1);
		}
	}
	whereOrAnd = query.includes('WHERE') ? 'AND' : 'WHERE';
	if (dateEnd) {
		query += ` ${whereOrAnd} created_at <= $${params.length + 1}`;
		params.push(dateEnd.toISOString());
	}
	return query;
}
