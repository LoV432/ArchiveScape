import { db } from '@/lib/db';

export type RandomMessage = {
	message_text: string;
	color_name: string;
	id: number;
};

export async function getRandomMessage() {
	const totalUsers = (
		await db.query(`SELECT id as count FROM users order by id desc limit 1`)
	).rows[0].count;
	const randomOffset = Math.floor(Math.random() * (totalUsers - 1000));
	// We are calculating offset like this to avoid using random() sort in DB
	// This drops total time from 350ms~ to 50ms~
	const messages = (
		await db.query(
			`SELECT
				m.id as id,
				m.message_text as message_text,
				colors.color_name as color_name
			FROM messages m
			JOIN users u ON m.user_id = u.id
			LEFT JOIN colors ON m.color_id = colors.id
			WHERE m.user_id > $1
			GROUP BY m.id, m.message_text, colors.color_name
			HAVING COUNT(*) < 3 limit 10`,
			[randomOffset]
		)
	).rows as { id: number; message_text: string; color_name: string }[];
	let bestMessage = messages[0];
	for (const message of messages) {
		// TODO: Somehow filter out obvious troll messages, maybe using LLM?
		if (
			message.message_text.includes('https://') ||
			message.message_text.includes('http://') ||
			message.message_text.includes('www.')
		) {
			continue;
		}
		if (Math.random() < 0.05 && message.message_text.length > 20) {
			bestMessage = message;
			break;
		}
		if (message.message_text.length > bestMessage.message_text.length) {
			bestMessage = message;
		}
	}
	return {
		message_text: bestMessage.message_text,
		color_name: bestMessage.color_name,
		id: bestMessage.id
	};
}
