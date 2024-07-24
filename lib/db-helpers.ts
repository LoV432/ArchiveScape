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
