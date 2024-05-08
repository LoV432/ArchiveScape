import { db } from '@/lib/db';

export async function getSearch(searchQuery: string, page: number) {
	if (!searchQuery || searchQuery === '') {
		return { messages: [], totalPages: 0 };
	}
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	try {
		const messages = await db.query(
			`SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE lower(message_text) LIKE lower($1) ORDER BY created_at DESC LIMIT $3 OFFSET $2`,
			[`%${searchQuery}%`, (Number(page) - 1) * itemsPerPage, itemsPerPage]
		);
		const totalPages = Math.ceil(
			(
				await db.query(
					`SELECT COUNT(*) FROM messages WHERE lower(message_text) LIKE lower($1)`,
					[`%${searchQuery}%`]
				)
			).rows[0]['count'] / itemsPerPage
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
