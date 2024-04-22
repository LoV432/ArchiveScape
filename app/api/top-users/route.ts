import { getDatabase } from '@/lib/db';

export async function GET() {
	const db = await getDatabase();
	try {
		const topUsers = await db.all(`
			SELECT u.userName, m.userId, COUNT(*) AS messageCount
			FROM messages m
			JOIN users u ON m.userId = u.id
			GROUP BY u.userName
			ORDER BY messageCount DESC
			LIMIT 10`);
		return new Response(JSON.stringify(topUsers));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}
