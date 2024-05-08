import { db } from './db';

export type Message = {
	id: number;
	created_at: string;
	message_text: string;
	user_id: number;
	color_name: string;
};

export async function getAllMessages(page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const messages = await db.query(
		`SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id
        FROM messages 
        LEFT JOIN colors ON messages.color_id = colors.id 
        ORDER BY created_at DESC
        OFFSET $1 LIMIT $2`,
		[Number(page) * itemsPerPage - itemsPerPage, itemsPerPage]
	);
	const totalPages = Math.ceil(
		(await db.query('SELECT COUNT(*) FROM messages')).rows[0]['count'] /
			itemsPerPage
	);
	return { messages: messages.rows as Message[], totalPages };
}
