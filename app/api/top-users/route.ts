import { getDatabase } from '@/lib/db';

export async function GET() {
	const db = await getDatabase();
	try {
		const messages = await db.all(`
			SELECT u.userId, COUNT(*) AS messageCount
			FROM messages m
			JOIN users_id u ON m.userId = u.id
			GROUP BY u.userId
			ORDER BY messageCount DESC
			LIMIT 10`);
		return new Response(JSON.stringify(messages));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}
