import { db } from './db';

// I am using this instead of unstable_cache because unstable_cache does stale while revalidate
let lastUpdated = 0;
let countCache: { usersCount: number; messagesCount: number };
export async function getCount() {
	const now = Date.now();
	if (now - lastUpdated < 1000 * 60 * 5 && countCache.usersCount > 0) {
		return countCache;
	}
	lastUpdated = now;
	console.log(`Cache Miss ${new Date().toISOString()}`);
	try {
		const usersCount = (await db.query('SELECT COUNT(*) as count FROM users'))
			.rows[0].count;
		const messagesCount = (
			await db.query('SELECT COUNT(*) as count FROM messages')
		).rows[0].count;
		countCache = { usersCount, messagesCount };
		return { usersCount, messagesCount } as {
			usersCount: number;
			messagesCount: number;
		};
	} catch (error) {
		console.error(error);
		return { usersCount: 0, messagesCount: 0 } as {
			usersCount: number;
			messagesCount: number;
		};
	}
}
