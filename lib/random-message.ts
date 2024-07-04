import { db } from '@/lib/db';

export type RandomMessage = {
	message_text: string;
	color_name: string;
};

export async function getRandomMessage() {
	const totalUsers = (
		await db.query(`SELECT id as count FROM users order by id desc limit 1`)
	).rows[0].count;
	const randomOffset = Math.floor(Math.random() * (totalUsers - 1000));
	// We are calculating offset like this to avoid using random() sort in DB
	// This drops total time from 350ms~ to 50ms~
	const user = (
		await db.query(
			`SELECT m.user_id
			FROM messages m
			JOIN users u ON m.user_id = u.id
			WHERE m.user_id > $1
			GROUP BY m.user_id
			HAVING COUNT(*) < 5 limit 1`,
			[randomOffset]
		)
	).rows[0];
	const message = (
		await db.query(
			`SELECT message_text, colors.color_name, user_id FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE user_id = $1`,
			[user.user_id]
		)
	).rows as RandomMessage[];
	return {
		message_text: message[1]?.message_text || message[0].message_text,
		color_name: message[1]?.color_name || message[0].color_name
	};
}
