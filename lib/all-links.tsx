import { db } from '@/lib/db';
import { Message } from './all-messages';

export async function getAllLinks(page: number) {
	const messagesWithLinks = (
		await db.query(
			`SELECT m.id, message_text, user_id, color_name, created_at FROM messages m LEFT JOIN colors c ON m.color_id = c.id WHERE message_text ~ 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+' ORDER BY created_at DESC OFFSET $1 LIMIT 10`,
			[Number(page) * 10 - 10]
		)
	).rows as Message[];
	const totalPages = Math.ceil(
		(
			await db.query(
				`SELECT COUNT(*) FROM messages WHERE message_text ~ 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'`
			)
		).rows[0]['count'] / 10
	);
	return {
		links: messagesWithLinks,
		totalPages
	};
}
