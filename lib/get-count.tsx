import { db } from './db';

// I am using this instead of unstable_cache because unstable_cache does stale while revalidate
let lastUpdated = 0;
let countCache: { usersCount: string; messagesCount: string };
export async function getCount() {
	const now = Date.now();
	if (
		now - lastUpdated < 1000 * 60 * 5 &&
		parseInt(countCache.usersCount) > 0
	) {
		return countCache;
	}
	lastUpdated = now;
	try {
		const usersCount = (await db.query('SELECT COUNT(*) as count FROM users'))
			.rows[0].count as string;
		const messagesCount = (
			await db.query('SELECT COUNT(*) as count FROM messages')
		).rows[0].count as string;
		countCache = { usersCount, messagesCount };
		return { usersCount, messagesCount };
	} catch (error) {
		console.error(error);
		return { usersCount: '0', messagesCount: '0' };
	}
}
