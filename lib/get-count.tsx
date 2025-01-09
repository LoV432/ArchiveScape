import { db } from './db';

export async function getCount() {
	try {
		const usersCount = (await db.query('SELECT COUNT(*) as count FROM users'))
			.rows[0].count as string;
		const messagesCount = (
			await db.query('SELECT COUNT(*) as count FROM messages')
		).rows[0].count as string;
		return { usersCount, messagesCount };
	} catch (error) {
		console.error(error);
		return { usersCount: '0', messagesCount: '0' };
	}
}
