import { db } from '@/lib/db';

export async function getSearch(
	searchQuery: string,
	page: number,
	dateStart?: Date,
	dateEnd?: Date
) {
	if (!searchQuery || searchQuery === '') {
		return { messages: [], totalPages: 0 };
	}
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	try {
		// Build get messages query
		let queryBuilder = `SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE lower(message_text) LIKE lower($1)`;
		let params: any[] = [`%${searchQuery}%`];
		if (dateStart) {
			queryBuilder += ` AND created_at >= $${params.length + 1}`;
			params.push(dateStart.toISOString());
			if (!dateEnd) {
				// If this is true we assume that the user wants to see all messages for the dateStart day
				dateEnd = new Date(dateStart);
				dateEnd.setDate(dateEnd.getDate() + 1);
			}
		}
		if (dateEnd) {
			queryBuilder += ` AND created_at <= $${params.length + 1}`;
			params.push(dateEnd.toISOString());
		}
		queryBuilder += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
		params.push(itemsPerPage, (Number(page) - 1) * itemsPerPage);
		const messages = await db.query(queryBuilder, params);

		// Build total pages query
		let totalPagesQuery = `SELECT COUNT(*) FROM messages WHERE lower(message_text) LIKE lower($1)`;
		params = [`%${searchQuery}%`];
		if (dateStart) {
			totalPagesQuery += ` AND created_at >= $${params.length + 1}`;
			params.push(dateStart.toISOString());
		}
		if (dateEnd) {
			totalPagesQuery += ` AND created_at <= $${params.length + 1}`;
			params.push(dateEnd.toISOString());
		}
		const totalPages = Math.ceil(
			(await db.query(totalPagesQuery, params)).rows[0]['count'] / itemsPerPage
		);
		return {
			messages: messages.rows,
			totalPages
		};
	} catch (error) {
		console.log(error);
		throw new Error('Error');
	}
}
