import { db } from '@/lib/db';

export type RandomMessage = {
	message_text: string;
	color_name: string;
};

export async function getRandomMessage() {
	const user = (
		await db.query(`SELECT m.user_id
        FROM messages m
        JOIN users u ON m.user_id = u.id
        GROUP BY m.user_id
        HAVING COUNT(*) < 5 ORDER BY RANDOM() LIMIT 1`)
	).rows[0];
	const message = (
		await db.query(
			`SELECT message_text, colors.color_name FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE user_id = $1`,
			[user.user_id]
		)
	).rows as RandomMessage[];
	return {
		message_text: message[1]?.message_text || message[0].message_text,
		color_name: message[1]?.color_name || message[0].color_name
	};
}
