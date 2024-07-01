import { db } from '@/lib/db';
import { Message } from './all-messages';

export async function getAllLinks(page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const messagesWithLinks = (
		await db.query(
			`SELECT m.id, message_text, user_id, color_name, created_at FROM messages m LEFT JOIN colors c ON m.color_id = c.id WHERE message_text ~ 'http' ORDER BY created_at DESC OFFSET $1 LIMIT $2`,
			[Number(page) * itemsPerPage - itemsPerPage, itemsPerPage]
		)
	).rows as Message[];
	const totalPages = Math.ceil(
		(
			await db.query(
				`SELECT COUNT(*) FROM messages WHERE message_text ~ 'http'`
			)
		).rows[0]['count'] / itemsPerPage
	);
	return {
		links: messagesWithLinks,
		totalPages
	};
}
