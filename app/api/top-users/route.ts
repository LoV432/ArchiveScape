import { db } from '@/lib/db';

export async function GET() {
	try {
		const topUsers =
			await db.query(`SELECT u.user_name, m.user_id, COUNT(*) AS message_count
			FROM messages m
			JOIN users u ON m.user_id = u.id
			GROUP BY u.user_name, m.user_id
			ORDER BY message_count DESC
			LIMIT 10`);
		return new Response(JSON.stringify({ topUsers: topUsers.rows }));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}
