import { db } from '@/lib/db';

export async function getUserMessages(userId: number, page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	try {
		const messages = await db.query(
			`SELECT messages.id, message_text, created_at, colors.color_name FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE user_id = $1 ORDER BY created_at DESC LIMIT $3 OFFSET $2`,
			[userId, (Number(page) - 1) * itemsPerPage, itemsPerPage]
		);
		const totalPages = Math.ceil(
			(
				await db.query(`SELECT COUNT(*) FROM messages WHERE user_id = $1`, [
					userId
				])
			).rows[0]['count'] / itemsPerPage
		);
		const user = await db.query(`SELECT user_name FROM users WHERE id = $1`, [
			userId
		]);
		return {
			messages: messages.rows,
			totalPages,
			user_name: user.rows[0].user_name
		};
	} catch (error) {
		console.log(error);
		throw new Error('Error');
	}
}
